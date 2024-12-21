import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

export default function EditItem({ isOpen, item, onItemEdited, onCancel }) {
  const [form] = Form.useForm(); // สร้าง form instance

  // ใช้ useEffect เพื่อตรวจสอบ isOpen และตั้งค่า Form
  useEffect(() => {
    if (isOpen && item) {
      form.setFieldsValue(item); // ตั้งค่าเริ่มต้นของฟอร์มด้วยข้อมูลจาก props.item
    }
  }, [isOpen, item, form]);

  // Handle เมื่อกดปุ่ม OK
  const handleFormSubmit = () => {
    form
      .validateFields() // ตรวจสอบความถูกต้องของฟอร์ม
      .then((formData) => {
        onItemEdited(formData); // ส่งข้อมูลที่แก้ไขกลับไป
        form.resetFields(); // รีเซ็ตฟอร์ม
      })
      .catch((error) => {
        console.error("Form validation failed:", error);
      });
  };

  return (
    <Modal
      title="Edit Item"
      open={isOpen}
      onOk={handleFormSubmit} // กด OK แล้วเรียก handleFormSubmit
      onCancel={() => {
        form.resetFields(); // รีเซ็ตฟอร์มเมื่อปิด
        onCancel(); // แจ้งให้ Component แม่ทราบว่าปิด Modal แล้ว
      }}
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
  );
}
