import React, { useState } from "react";
import { Button, Table, Space, Tag, Popconfirm, Modal, Form, Input, InputNumber, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";

export default function TransactionList(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedRecord = { ...editingRecord, ...values };
      console.log("Form Values:", values);
      console.log("Updated Record:", updatedRecord);
      props.onRowUpdated(updatedRecord);
      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Date-Time",
      dataIndex: "action_datetime",
      key: "action_datetime",
      render: (action_datetime) =>
        moment(action_datetime).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, record) => (
        <Tag color={record.type === "income" ? "green" : "red"}>
          {record.type}
        </Tag>
      ),
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete the transaction"
            onConfirm={() => props.onRowDeleted(record.id)}
          >
            <Button
              style={{ backgroundColor: "red", borderColor: "yellow", color: "black" }}
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>

          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={props.data} rowKey="id" />
      <Modal
        title="Edit Transaction"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select a type!" }]}
          >
            <Select
              options={[
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter an amount!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
            rules={[{ required: true, message: "Please enter a note!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
