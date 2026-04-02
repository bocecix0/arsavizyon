-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  credits integer default 3,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Generations table
create table if not exists generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  land_image_url text,
  render_image_url text,
  video_url text,
  building_style text not null,
  status text default 'pending',
  credits_used integer default 4,
  fal_request_id text,
  created_at timestamptz default now()
);

alter table generations enable row level security;

create policy "Users can view own generations"
  on generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own generations"
  on generations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own generations"
  on generations for update
  using (auth.uid() = user_id);

-- Credit transactions table
create table if not exists credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  amount integer not null,
  description text,
  stripe_session_id text,
  created_at timestamptz default now()
);

alter table credit_transactions enable row level security;

create policy "Users can view own transactions"
  on credit_transactions for select
  using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, credits)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    3
  );

  -- Add initial credit transaction
  insert into public.credit_transactions (user_id, amount, description)
  values (new.id, 3, 'Kayıt bonusu - 3 ücretsiz kredi');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('land-photos', 'land-photos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('renders', 'renders', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload land photos"
  on storage.objects for insert
  with check (bucket_id = 'land-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own land photos"
  on storage.objects for select
  using (bucket_id = 'land-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view renders"
  on storage.objects for select
  using (bucket_id = 'renders');

create policy "Service role can upload renders"
  on storage.objects for insert
  with check (bucket_id = 'renders');

create policy "Anyone can view videos"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Service role can upload videos"
  on storage.objects for insert
  with check (bucket_id = 'videos');
