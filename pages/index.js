import { EmptyState, Layout, Page } from '@shopify/polaris'

const Index = () => {
  return (
    <Page>
      <Layout>
        <EmptyState
          heading="Manage your inventory transfers"
          action={{ content: 'Select Products' }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        ></EmptyState>
      </Layout>
    </Page>
  )
}

export default Index
