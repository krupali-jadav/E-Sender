import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Typography,
  Row,
  Col,
  Table,
  Divider,
  Button,
  message,
  Image,
  Tag,
  Flex,
} from "antd";
import {
  CloudDownloadOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { CURRENCIES_SYMBOL, formatDate } from "../../util/commom.utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axiosInstance from "../../util/axiosInstance";
import { getMediaPath } from "../../util/getMediaPath";
import { changePageTitle } from "../../redux/reducers/reducer.app";
import { Space } from "antd/lib";
const { Title, Text, Paragraph } = Typography;
const Invoice = ({ isEdit = false }) => {
  const { order_id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state?.app?.theme);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const isFetchingOrderRef = useRef(false);
  const lastFetchedOrderIdRef = useRef(null);
  const packs = useSelector((state) => state?.app?.packs);
  const panel = useSelector((state) => state?.app?.panel);
  const products = useSelector((state) => state?.app?.products);

  const getProduct = useCallback(
    (packId) => packs?.find((p) => p?._id === packId),
    [packs],
  );
  const getProducts = useCallback(
    (productId) => products?.find((p) => p?.productId === productId),
    [products],
  );

  const itemName = useCallback(
    (item) => {
      if (order?.type !== "pack" || !item?.packId) return "N/A";
      const pack = getProduct(item.packId);
      if (!pack?.type) return "N/A";
      return `Buy pack - ${pack.type}`;
    },
    [getProduct, order?.type],
  );
  const productName = useCallback(
    (item) => {
      if (order.type === "remove-device") {
        return (
          <>
            {t("remove.device", {
              defaultValue: "Remove Device",
            })}{" "}
            <br /> {item?.licenseId?.key}
          </>
        );
      }
      const validTypes = [
        "buy-license-keys",
        "buy-product",
        "buy-rebranding",
        "key-transfer",
      ];
      if (!validTypes.includes(order?.type) || !item?.productId) return "N/A";
      const product = getProducts(item.productId);
      if (!product?.name) return "N/A";
      const buyTypeMap = {
        "buy-license-keys": "Buy reseller pack of",
        "buy-product": "Buy license keys of",
        "buy-rebranding": "Buy rebranding of",
        "key-transfer": "Transfer",
      };
      const buyType = buyTypeMap[order?.type] || "Buy";
      const variation = product?.rate?.reseller?.find(
        (v) => v?._id === item?.variationId,
      );
      return variation?.title
        ? `${buyType} ${product?.name} - ${variation?.title}`
        : `${buyType} ${product?.name}`;
    },
    [getProducts, order],
  );

  const fetchOrderDetail = useCallback(async () => {
    if (!order_id) return;
    if (isFetchingOrderRef.current) return;
    if (lastFetchedOrderIdRef.current === order_id) return;

    isFetchingOrderRef.current = true;
    lastFetchedOrderIdRef.current = order_id;
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/order/telecaller-admin/${order_id}`,
      );
      if (data?.status) {
        setOrder(data.order);
      } else {
        message.error(data?.message || "Failed to fetch order details");
      }
    } catch (error) {
      lastFetchedOrderIdRef.current = null;
      message.error("Failed to load order details");
    } finally {
      isFetchingOrderRef.current = false;
      setLoading(false);
    }
  }, [order_id]);
  const triggerType = useMemo(() => {
    return isEdit ? ["text", "icon"] : [];
  }, [isEdit]);
  const handleAmountChange = (value, recordId) => {
    const numericValue = parseFloat(value) || 0;
    setOrder((prev) => {
      let newSubTotal = 0;
      const updatedItems = prev?.items?.map((item) => {
        if (item._id === recordId) {
          const itemTotal = numericValue * (item.quantity || 1);
          newSubTotal += itemTotal;
          return {
            ...item,
            amount: numericValue,
            total: itemTotal.toFixed(2),
          };
        }
        newSubTotal += item.total ? parseFloat(item.total) : 0;
        return item;
      });
      return {
        ...prev,
        items: updatedItems,
        subTotal: newSubTotal,
        total: newSubTotal,
      };
    });
  };
  const columns = [
    {
      title: t("sn", {
        defaultValue: "S/N",
      }),
      dataIndex: "SN",
      key: "SN",
      width: 30,
      fixed: "left",
      render: (_, __, index) => <Text>{index + 1}</Text>,
    },
    {
      title: t("name", {
        defaultValue: "Name",
      }),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (_, record) => {
        if (order?.type === "pack") return itemName(record);
        if (["buy-telecaller", "renew-telecaller"].includes(order?.type)) {
          return record?.extra?.telecallers?.length
            ? record.extra.telecallers
              .map((t) => t.telecallerName)
              .join(", ")
            : "N/A";
        }
        return productName(record);
      }
    },
    {
      title: t("price", {
        defaultValue: "Price",
      }),
      dataIndex: "price",
      key: "price",
      width: 60,
      render: (_, record) => (
        <>
          {`${CURRENCIES_SYMBOL[order?.paymentId?.currency] || "$"}`}
          <Typography.Text
            editable={{
              onChange: (val) => handleAmountChange(val, record._id),
              triggerType,
            }}
          >
            {`${(record?.amount || 0).toFixed(2)}`}
          </Typography.Text>
        </>
      ),
    },
    {
      title: t("quantity", {
        defaultValue: "Quantity",
      }),
      dataIndex: "quantity",
      key: "quantity",
      width: 50,
      render: (_, record) => record?.quantity || 0,
    },
    {
      title: t("total", {
        defaultValue: "Total",
      }),
      dataIndex: "salePrice",
      key: "salePrice",
      width: 50,
      align: "right",
      render: (_, record) =>
        `${CURRENCIES_SYMBOL[order?.paymentId?.currency] || "$"}${((record?.amount || 0) * (record?.quantity || 0)).toFixed(2)}`,
    },
  ];

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);
  useEffect(() => {
    dispatch(changePageTitle("Order Invoice"));
  }, [dispatch]);
  const renderAddress = (address) => {
    if (!address) return "No address available";
    return `${address.addressLine1 || ""} ${address.addressLine2 || ""},
            ${address.city || ""}, ${address.state || ""},
            ${address.zip || ""}, ${address.country || ""}`.trim();
  };
  const handleDownloadInvoice = useCallback(() => {
    if (!order_id) return false;
    const elementToBeCaptured = document.getElementById("master_order_invoice");
    if (!elementToBeCaptured) {
      message.error("Failed to download invoice!");
      return;
    }
    const a4Width = 595.28;
    const a4Height = 841.89;
    const loadingMessage = message.loading("Generating PDF...", 0);
    const dpi = 300 / 72;
    const contentHeight = Math.ceil(
      elementToBeCaptured.getBoundingClientRect().height,
    );
    const contentWidth = Math.ceil(
      elementToBeCaptured.getBoundingClientRect().width,
    );
    const scaleWidth = (a4Width * dpi) / contentWidth;
    const scaleHeight = (a4Height * dpi) / contentHeight;
    const scale = Math.min(scaleWidth, scaleHeight) * 0.95;
    const options = {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      width: contentWidth,
      height: contentHeight,
      windowWidth: contentWidth,
      windowHeight: contentHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById("master_order_invoice");
        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.transformOrigin = "top left";
          clonedElement.style.width = `${contentWidth}px`;
          clonedElement.style.height = `${contentHeight}px`;

          clonedElement.style.fontDisplay = "swap";
          clonedElement.style.webkitFontSmoothing = "antialiased";
          clonedElement.style.mozOsxFontSmoothing = "grayscale";
          clonedElement.style.textRendering = "optimizeLegibility";

          const images = clonedElement.getElementsByTagName("img");
          Array.from(images).forEach((img) => {
            img.style.imageRendering = "high-quality";
          });
        }
      },
    };
    html2canvas(elementToBeCaptured, options)
      .then((canvas) => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
          compress: true,
          precision: 16,
        });

        const scaledWidth = contentWidth * (scale / dpi);
        const scaledHeight = contentHeight * (scale / dpi);
        const xPosition = Math.max(0, (a4Width - scaledWidth) / 2);
        const yPosition = Math.max(0, (a4Height - scaledHeight) / 2);

        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          xPosition,
          yPosition,
          scaledWidth,
          scaledHeight,
          undefined,
          "FAST",
          0,
        );

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice_${order_id}.pdf`;

        link.onload = () => {
          loadingMessage();
          loadingMessage();
          message.success("PDF generated successfully!");
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(url);
        };

        link.onerror = () => {
          loadingMessage();
          message.error("Failed to download PDF");
          URL.revokeObjectURL(url);
        };

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          loadingMessage();
          message.success("PDF generated successfully!");
          URL.revokeObjectURL(url);
        }, 100);
      })
      .catch((error) => {
        loadingMessage();
        message.error("Failed to capture invoice");
      });
  }, [order_id]);
  return (
    <React.Fragment>
      <Row
        style={{
          gap: "5px",
          flexDirection: "row-reverse",
          marginBottom: "13px",
        }}
      >
        <Button
          style={{
            background: "#D6F4DE",
            color: "green",
            border: "none",
          }}
          key="download_invoice"
          onClick={handleDownloadInvoice}
        >
          <CloudDownloadOutlined />{" "}
          {t("setting.download", {
            defaultValue: "Download",
          })}
        </Button>
      </Row>
      <Flex
        vertical
        style={{
          margin: "auto",
          maxWidth: "595.28pt",
          boxSizing: "border-box",
        }}
        className="invoice_card"
        id="master_order_invoice"
      >
        <Space
          direction="vertical"
          style={{
            backgroundColor: theme ? "#333333" : "#FFFFFF",
            padding: "10mm",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <Row gutter={200} justify="space-between">
            <Col sx={24} md={12}>
              <Image
                preview={false}
                src={getMediaPath(order?.panelId?.billing?.logo)}
                alt="INVOICE LTD"
                loading="lazy"
              />
            </Col>
            <Col sx={24} md={12}>
              <Title
                level={2}
                style={{
                  margin: 0,
                }}
              >
                {t("invoice", {
                  defaultValue: "Invoice",
                })}
              </Title>
              <Text copyable>
                {t("orderid", {
                  defaultValue: "Order ID",
                })}
                : {order?._id || "N/A"}
              </Text>
              <br />
              <Text>
                {t("date", {
                  defaultValue: "Date",
                })}{" "}
                : {order?.createdAt ? formatDate(order.createdAt) : "N/A"}
              </Text>
              <br />
              <Text>
                {t("order.status", {
                  defaultValue: "Order Status",
                })}{" "}
                : {t(order?.status) || "N/A"}
              </Text>
            </Col>
          </Row>
          <Row gutter={200} justify="space-between">
            <Col sx={24} md={12}>
              <Title level={5}>
                {t("invoiceto", {
                  defaultValue: "Invoice To",
                })}{" "}
                :
              </Title>
              <Text strong>{panel?.billing?.name || "Company"}</Text>
              <br />
              <Text>
                <EnvironmentOutlined /> {panel?.billing?.address || "-"}
              </Text>
              <br />
              <Text>
                <PhoneOutlined /> {panel?.billing?.phone || ""}
              </Text>
              <br />
              <Text>
                <MailOutlined /> {panel?.billing?.email || ""}
              </Text>
            </Col>
            <Col sx={24} md={12}>
              <Title level={5}>
                {t("payto", {
                  defaultValue: "Pay To",
                })}{" "}
                :
              </Title>
              <Text strong>{order?.name || "Username"}</Text>
              <br />
              <Text>
                <EnvironmentOutlined /> {renderAddress(order?.userId?.address)}
              </Text>
              <br />
              <Text>
                <PhoneOutlined /> {order?.phone || "Phone"}
              </Text>
              <br />
              <Text>
                <MailOutlined /> {order?.email || "Email"}
              </Text>
            </Col>
          </Row>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Table
              columns={columns}
              dataSource={order?.items || []}
              rowKey={(record, index) => record?._id || index}
              loading={loading}
              pagination={false}
              scroll={{
                x: 350,
              }}
              style={{
                marginTop: "30px",
              }}
              footer={() => (
                <Row
                  justify="end"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <Col span={10}>
                    <Row justify="space-evenly">
                      <Col span={12}>
                        {t("sub.total", {
                          defaultValue: "Sub Total",
                        })}
                      </Col>
                      <Col span={12} style={{ textAlign: "right" }}>
                        {`${CURRENCIES_SYMBOL[order?.paymentId?.currency] || "$"
                          }${order?.subTotal.toFixed(2) || "0"}`}
                      </Col>
                    </Row>
                    <Row justify="space-evenly">
                      <Col span={12}>
                        {t("handling.fee", { defaultValue: "Handling Fee" })} (
                        {`${order?.subTotal
                            ? (
                              (order?.handlingFee / order?.subTotal) *
                              100
                            ).toFixed(0)
                            : "0"
                          }%`}
                        )
                      </Col>
                      <Col span={12} style={{ textAlign: "right" }}>
                        {`${CURRENCIES_SYMBOL[order?.paymentId?.currency] || "$"
                          }${order?.handlingFee.toFixed(2) || "0"}`}
                      </Col>
                    </Row>
                    <Divider
                      style={{
                        margin: "10px 0",
                      }}
                    />
                    <Row justify="space-evenly">
                      <Col span={12}>
                        <Text strong>
                          {t("grand.total", {
                            defaultValue: "Grand Total",
                          })}
                        </Text>
                      </Col>
                      <Col
                        span={12}
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <Text strong>
                          {`${CURRENCIES_SYMBOL[order?.paymentId?.currency] || "$"
                            }${order?.total.toFixed(2) || "0"}`}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            />
          </Space>

          <Row>
            <Col span={12}>
              <Title level={5}>
                {t("paymentinfo", {
                  defaultValue: "Payment Info",
                })}
              </Title>
              <Text copyable>
                {t("paymentid", {
                  defaultValue: "Payment ID",
                })}{" "}
                : {order?.paymentId?._id || "N/A"}
              </Text>
              <br />
              <Row align="middle" gutter={8}>
                <Col>
                  <Text>
                    {t("payment.gateway", {
                      defaultValue: "Payment Gateway",
                    })}{" "}
                    :
                  </Text>
                </Col>
                <Col>
                  {order?.paymentId?.gateway ? (
                    <Image
                      src={getMediaPath(
                        `/media/payment-gateway/${order?.paymentId?.gateway}.png`,
                      )}
                      preview={false}
                      alt={order?.paymentId?.gateway}
                      width={60}
                    />
                  ) : (
                    <Text>N/A</Text>
                  )}
                </Col>
              </Row>
              <Text>
                {t("status", {
                  defaultValue: "Status",
                })}{" "}
                :{" "}
                {order?.paymentId?.status === "paid" ? (
                  <Tag color="#87d068">
                    {t("paid", {
                      defaultValue: "Paid",
                    })}
                  </Tag>
                ) : (
                  <Tag
                    color="#f50"
                    style={{
                      marginRight: 10,
                    }}
                  >
                    {t("unpaid", {
                      defaultValue: "Unpaid",
                    })}
                  </Tag>
                )}
              </Text>
            </Col>
          </Row>

          <Divider />

          <Row justify="space-between" style={{ textAlign: "Left" }}>
            <Col>
              <Space
                direction="vertical"
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                }}
              >
                {" "}
                <Image
                  preview={false}
                  src={getMediaPath(panel?.billing?.logo)}
                  width={100}
                  alt="INVOICE LTD"
                  loading="lazy"
                />
              </Space>
              <Paragraph
                style={{
                  textAlign: "left",
                }}
              >
                {t("invoice.footer", {
                  companyName: panel?.billing?.name,
                  defaultValue:
                    "Thank You For Your Interest In {{companyName}} Products. Your Order Has Been Received And Will Be Processed Once Payment Has Been Confirmed.",
                })}
              </Paragraph>
            </Col>
          </Row>
        </Space>
      </Flex>
    </React.Fragment>
  );
};
export default Invoice;
