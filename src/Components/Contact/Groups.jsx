import { PageContainer } from '@ant-design/pro-components'
import React from 'react'
import SearchHeader from '../Search Header/SearchHeader'

function Groups() {
  return (
    <PageContainer
      title="Groups"
      breadcrumb={false}
    >
      <SearchHeader />
    </PageContainer>
  )
}

export default Groups
