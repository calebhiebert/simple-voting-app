import gql from 'graphql-tag';

/**
 * Graphql Queries
 * The following section contains all queries used in the application
 */
export const GET_ALL_SUBJECTS_QUERY = gql`
  query GetAllSubjects {
    subjects {
      id
      personName
      costumeDescription
      voteCount
    }
  }
`;

export const GET_SUBJECT_BASIC_QUERY = gql`
  query GetSubject($id: ID!) {
    subject(id: $id) {
      id
      personName
      costumeDescription
      voteCount
    }
  }
`;

export const EDIT_HISTORY_QUERY = gql`
  query GetSubject($id: ID!) {
    subject(id: $id) {
      id
      history {
        id
        createdAt
        personName
        costumeDescription
        editor {
          id
          name
        }
      }
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      banned
      admin
    }
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    user {
      id
      name
      banned
      admin
    }
  }
`;

export const VOTED_FOR_QUERY = gql`
  query VotedFor {
    votedFor {
      id
    }
  }
`;

/**
 * Graphql Mutations
 * The following section contains all the mutation queries used in the
 * application
 */
export const VOTE_MUTATION = gql`
  mutation DoVote($subjectId: ID!) {
    vote(subjectId: $subjectId) {
      id
      updatedAt
      voter {
        id
        name
      }
      subject {
        id
        votes {
          id
        }
      }
    }
  }
`;

export const DELETE_SUBJECT_MUTATION = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`;

export const CREATE_SUBJECT_MUTATION = gql`
  mutation CreateSubject($subject: SubjectCreation!) {
    createSubject(input: $subject) {
      id
      personName
      costumeDescription
      voteCount
      history {
        id
        createdAt
        editor {
          id
          name
        }
      }
    }
  }
`;

export const EDIT_SUBJECT_MUTATION = gql`
  mutation UpdateSubject($subject: SubjectMutation!) {
    updateSubject(input: $subject) {
      id
      personName
      costumeDescription
      history {
        id
        personName
        costumeDescription
        createdAt
        editor {
          id
        }
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UserMutation!) {
    updateUser(input: $input) {
      id
      name
      banned
      admin
      updatedAt
    }
  }
`;

/**
 * Graphql Subscriptions
 * The following section contains all the subscription queries used in the
 * application
 */
export const VOTE_CAST_SUBSCRIPTION = gql`
  subscription VoteUpdates {
    voteCast {
      id
      voteCount
      votes {
        id
        voter {
          id
          name
        }
        updatedAt
      }
    }
  }
`;

export const SUBJECT_CHANGED_SUBSCRIPTION = gql`
  subscription SubjectChanged($id: ID!) {
    subjectChanged(id: $id) {
      id
      personName
      costumeDescription
      votes {
        id
        voter {
          id
          name
        }
        updatedAt
      }
      history {
        id
        personName
        costumeDescription
        editor {
          id
          name
        }
        createdAt
      }
      voteCount
    }
  }
`;
