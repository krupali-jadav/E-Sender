import { SearchOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components';
import { Input } from 'antd';
import { Card, Col, Row } from 'antd'
import { t } from 'i18next'

function Templates() {


  return (
    <PageContainer
      // title="Templates"
      // breadcrumb={false}
    >

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
            <Input.Search
              // placeholder={t("search_leads", {
              //     defaultValue: "Search Leads",
              // })}
              placeholder="Search Contacts"
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>



        </Row>
      </Card>
    </PageContainer>
  )
}

export default Templates