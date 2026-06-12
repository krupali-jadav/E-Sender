import { Col, Flex, Image } from 'antd'
import { FaWifi } from 'react-icons/fa'
import { GiNetworkBars } from 'react-icons/gi'
import { RiBattery2ChargeFill } from 'react-icons/ri'
import Island from "../../../assets/Island.png"

function PhonePreview() {
  return (
     <Flex xs={24} lg={8} >
            <Col
              style={{
                width: 330,
                height: 580,
                margin: "0 auto",
                border: "1.5px solid #222",
                borderRadius: 40,
                padding: 6,
                background: "#f8f8f8",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              <Col
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid #222",
                  borderRadius: 34,
                  background: "#fff",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Col
                  style={{
                    height: 55,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 600,
                    fontSize: 16,
                    position: "relative",
                  }}
                >
                  <Col>4:43</Col>

                  <Col>
                    <Image src={Island} alt="Dynamic Island" style={{ width: 78, height: 26 }} preview={true} />
                  </Col>

                  <Col><GiNetworkBars /> <FaWifi /> <RiBattery2ChargeFill /></Col>
                </Col>
              </Col>
            </Col>
          </Flex>
  )
}

export default PhonePreview