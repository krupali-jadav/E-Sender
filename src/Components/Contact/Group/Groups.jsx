import { PageContainer } from '@ant-design/pro-components'
import React from 'react'
import SearchHeader from '../../Search Header/SearchHeader'
import { Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

function Groups() {
  return (
    <PageContainer
      title="Groups"
      breadcrumb={false}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // onClick={() => setAddContactOpen(true)}
          >
            Add Group
          </Button>

          {/* <AddContact
            open={AddContactOpen}
            onClose={() => setAddContactOpen(false)}
          /> */}
        </Space>
      }
    >
      <SearchHeader />
    </PageContainer>
  )
}

export default Groups
