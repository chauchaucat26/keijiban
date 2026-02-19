-- Create threads table
create table threads (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  author_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references threads(id) on delete cascade not null,
  name text default '名無し',
  message text not null,
  author_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reports table
create table reports (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index threads_category_idx on threads(category);
create index threads_updated_at_idx on threads(updated_at desc);
create index posts_thread_id_idx on posts(thread_id);
create index posts_created_at_idx on posts(created_at);

-- Create ng_words table
create table ng_words (
  id uuid default gen_random_uuid() primary key,
  word text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bans table
create table bans (
  id uuid default gen_random_uuid() primary key,
  author_id text not null,
  thread_id uuid references threads(id) on delete cascade, -- NULL = Global BAN
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for bans
create index bans_author_id_idx on bans(author_id);
create index bans_thread_id_idx on bans(thread_id);
