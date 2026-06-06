import  {
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
      fixed: "left",
      render: (_, __, index) => <Text>{index + 1}</Text>,
    },
    {
      title: t("name", {
        defaultValue: "Name",
      }),
      dataIndex: "type",
      key: "type",
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
      render: (_, record) => record?.quantity || 0,
    },
    {
      title: t("total", {
        defaultValue: "Total",
      }),
      dataIndex: "salePrice",
      key: "salePrice",
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
    <>
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
          onClick={handleDownloadInvoice}
        >
          <CloudDownloadOutlined /> Download
        </Button>
      </Row>

      <div
        id="master_order_invoice"
        style={{
          maxWidth: "700px",
          width: "100%",
          margin: "auto",
          background: theme ? "#333333" : "#ffff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title
              level={3}
              style={{
                margin: 0,
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              INVOICE
            </Title>
            <Flex vertical>
              <Text type="secondary">
                {t("issued", { defaultValue: "Issued" })}:{" "}:
                {order?.createdAt
                  ? formatDate(order.createdAt)
                  : "N/A"}
              </Text>
              <Text type="secondary">
                {t("order_id", { defaultValue: "Order Id" })}:
              </Text>
              <Text type="secondary">
                {t("date", { defaultValue: "Date" })}:
              </Text>
              <Text type="secondary">
                {t("order_status", { defaultValue: "Order Status" })}:
              </Text>
            </Flex>
          </Col>

          <Col>
            <Image
              preview={false}
              width={70}
              src={getMediaPath(order?.panelId?.billing?.logo)}
            />
          </Col>
        </Row>

        <Divider />

        {/* TOP INFO */}
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row
            style={{
              border: "1px solid #ececec",
            }}
          >
            <Col
              span={12}
              style={{
                padding: "20px",
                borderLeft: "1px solid #ececec",
              }}
            >
              <Text strong>Invoice To :</Text>
              <br />
              <br />
              <Flex vertical>
                <Text strong>{panel?.billing?.name || "Company"}</Text>
                <Text>
                  <EnvironmentOutlined /> {panel?.billing?.address || "Office"}
                </Text>
                <Text>
                  <PhoneOutlined /> {panel?.billing?.phone || "Phone"}
                </Text>
                <Text>
                  <MailOutlined /> {panel?.billing?.email || "Email"}
                </Text>
              </Flex>
            </Col>

            <Col
              span={12}
              style={{
                padding: "20px",
                borderLeft: "1px solid #ececec",
              }}
            >
              <Title level={5}>
                {t("payto", {
                  defaultValue: "Pay To",
                })}{" "}
                :
              </Title>
              <Flex vertical>
                <Text strong>{order?.name || "Username"}</Text>
                <Text>
                  <EnvironmentOutlined /> {renderAddress(order?.userId?.address)}
                </Text>
                <Text>
                  <PhoneOutlined /> {order?.phone || "Phone"}
                </Text>
                <Text>
                  <MailOutlined /> {order?.email || "Email"}
                </Text>
              </Flex>
            </Col>
          </Row>

          <Row
            style={{
              background: theme ? "#686767" : "#d8d8d8",
              padding: "12px 15px",
              fontWeight: 600,
              borderBottom: "1px solid #ececec",
            }}
          >
            {columns.map((col, index) => {
              const spans = [4, 9, 4, 5, 2];

              return (
                <Col key={col.key || index} span={spans[index]}>
                  {col.title}
                </Col>
              );
            })}
          </Row>

          <Row
            style={{
              padding: "5px 15px",
              borderBottom: "1px solid #ececec",
            }}
          >
            <Col span={4}>1</Col>
            <Col span={9}>Demo</Col>
            <Col span={4}>$100</Col>
            <Col span={5}>2</Col>
            <Col span={2}>$200</Col>
          </Row>
          {(order?.items || []).map((item, index) => (
            <Row
              key={index}
              style={{
                padding: "15px",
                borderBottom: "1px solid #f3f3f3",
              }}
            >
              <Col span={12}>
                <Text strong>
                  {order?.type === "pack"
                    ? itemName(item)
                    : productName(item)}
                </Text>
              </Col>

              <Col span={4}>
                {item?.quantity || 0}
              </Col>

              <Col span={4}>
                {CURRENCIES_SYMBOL[
                  order?.paymentId?.currency
                ] || "$"}
                {Number(item?.amount || 0).toFixed(2)}
              </Col>

              <Col
                span={4}
                style={{
                  textAlign: "right",
                }}
              >
                {CURRENCIES_SYMBOL[
                  order?.paymentId?.currency
                ] || "$"}
                {(
                  (item?.amount || 0) *
                  (item?.quantity || 0)
                ).toFixed(2)}
              </Col>
            </Row>
          ))}
          {/* </div> */}
        </Space>

        {/* TOTALS */}
        <Row justify="end" style={{ marginTop: 30 }}>
          <Col span={8}>
            <Row>
              <Col span={12}>Subtotal</Col>

              <Col span={12} style={{ textAlign: "right" }}>
                {CURRENCIES_SYMBOL[
                  order?.paymentId?.currency
                ] || "$0"}
                {order?.subTotal?.toFixed(2)}
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={12}>Handling Fee</Col>

              <Col span={12} style={{ textAlign: "right" }}>
                {CURRENCIES_SYMBOL[
                  order?.paymentId?.currency
                ] || "$0"}
                {order?.handlingFee?.toFixed(2)}
              </Col>
            </Row>

            <Divider style={{  borderTop: "1px solid black",marginBottom: 10, marginTop: 10}} />

            <Row >
              <Col span={12}>
                <Text strong>{t("grand_total", { defaultValue: "Grand Total" })}</Text>
              </Col>

              <Col span={12} style={{ textAlign: "right" }}>
                <Text strong>
                  {CURRENCIES_SYMBOL[
                    order?.paymentId?.currency
                  ] || "$0"}
                  {order?.total?.toFixed(2)}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* PAYMENT INFO */}
        <div style={{ marginTop: 40 }}>
          <Title level={5}>Payment Information</Title>

          <Text>
            Payment ID: {order?.paymentId?._id}
          </Text>
          <br />

          <Text>
            Payment Gateway: {order?.paymentId?._id}
          </Text>
          <br />
          <Text>
            {t("payment_status", {
              defaultValue: "Payment Status",
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
        </div>
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
      </div>
    </>
  );
};
export default Invoice;
