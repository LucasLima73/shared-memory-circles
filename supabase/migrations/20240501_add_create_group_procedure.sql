-- Create a stored procedure to handle group creation with owner in a single transaction
create or replace function public.create_group_with_owner(
  p_name text,
  p_is_private boolean,
  p_allow_all_photos boolean,
  p_user_id uuid
)
returns json
language plpgsql
security definer
as $$
declare
  v_group_id uuid;
  v_result json;
begin
  -- Insert the group
  insert into public.groups (
    name,
    is_private,
    allow_all_photos,
    created_by
  )
  values (
    p_name,
    p_is_private,
    p_allow_all_photos,
    p_user_id
  )
  returning id into v_group_id;

  -- Insert the group member as owner
  insert into public.group_members (
    group_id,
    user_id,
    role
  )
  values (
    v_group_id,
    p_user_id,
    'owner'
  );

  -- Return the group ID
  select json_build_object(
    'group_id', v_group_id
  ) into v_result;

  return v_result;
end;
$$;
