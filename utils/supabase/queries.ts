import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
	const { data: userDetails } = await supabase
		.from('User')
		.select('*')
		.single();
	return userDetails;
});

export const updateUser = async (
	supabase: SupabaseClient,
	userId: string,
	data: any,
) => {
	const { data: updatedUser, error } = await supabase
		.from('User')
		.update(data)
		.eq('id', userId)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return updatedUser;
};
