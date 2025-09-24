import { baseApi } from "../baseApi";

export const teamApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addTeam: builder.mutation({
            query: (teamData) => ({
                url: `/event/create/team`,
                method: 'POST',
                body: teamData
            }),
            invalidatesTags: ['team']
        }),
        getAllTeams: builder.query({
            query: (currentPage) => ({
                url: `/event/team?page=${currentPage}`,
                method: 'GET',
            }),
            providesTags: ['team'],
        }),
        getSingleTeam: builder.query({
            query: (id) => ({
                url: `/event/team/${id}`,
                method: 'GET',
            }),
            providesTags: ['team'],
        }),
        updateTeam: builder.mutation({
            query: ({ id, teamData }) => ({
                url: `/event/update-team/${id}`,
                method: 'PATCH',
                body: teamData
            }),
            invalidatesTags: ['team']
        }),
    }),
});

export const { useAddTeamMutation, useGetAllTeamsQuery, useGetSingleTeamQuery, useUpdateTeamMutation } = teamApi;