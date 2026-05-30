import React from 'react'
import SearchHeader from '../Search Header/SearchHeader'
import { PageContainer } from '@ant-design/pro-components'

function Contacts() {
  return (
    <>
      <PageContainer
        title="Contacts"
        breadcrumb={false}
      >
        <SearchHeader />
      </PageContainer>
    </>
  )
}

export default Contacts
