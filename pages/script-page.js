import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  Button,
  Card,
  Layout,
  Page,
  ResourceList,
  Stack,
} from '@shopify/polaris'

const CREATE_SCRIPT_TAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`
const QUERY_SCRIPT_TAGS = gql`
  query {
    scriptTags(first: 5) {
      edges {
        node {
          id
          src
          displayScope
        }
      }
    }
  }
`

const DELETE_SCRIPT_TAG = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`

function ScriptPage() {
  const [createScripts] = useMutation(CREATE_SCRIPT_TAG)
  const [deleteScripts] = useMutation(DELETE_SCRIPT_TAG)
  const { loading, error, data } = useQuery(QUERY_SCRIPT_TAGS)

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  console.log(data)

  return (
    <div>
      <h1>Current script tags:</h1>
      <button
        type="submit"
        onClick={() => {
          createScripts({
            variables: {
              input: {
                src: 'https://d2bde428dc92.ngrok.io/test-script.js',
                displayScope: 'ALL',
              },
            },
            refetchQueries: [{ query: QUERY_SCRIPT_TAGS }],
          })
        }}
      >
        Create Script Tag
      </button>

      {data.scriptTags.edges.map((item) => {
        return (
          <div key={item.node.id}>
            <p>{item.node.id}</p>
            <button
              type="submit"
              onClick={() => {
                deleteScripts({
                  variables: {
                    id: item.node.id,
                  },
                  refetchQueries: [{ query: QUERY_SCRIPT_TAGS }],
                })
              }}
            >
              Delete Script Tag
            </button>
          </div>
        )
      })}
    </div>
  )
}
//comment reset
export default ScriptPage
