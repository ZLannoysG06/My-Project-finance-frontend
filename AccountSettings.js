import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ใช้ useNavigate แทน useHistory

export default function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();  // สร้าง navigate instance

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserId(response.data.id);
        form.setFieldsValue({
          email: response.data.email,
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  const handleUpdate = async (formData) => {
    try {
      setIsLoading(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMsg("อัปเดตข้อมูลสำเร็จ!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับกลับสู่หน้าเดิม
  const handleGoBack = () => {
    navigate(-1);  // กลับสู่หน้าเดิมโดยใช้ navigate(-1)
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Spin spinning={isLoading}>
        <h2>ตั้งค่าบัญชี</h2>
        {successMsg && <Alert message={successMsg} type="success" />}
        {errorMsg && <Alert message={errorMsg} type="error" />}
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่านใหม่!" },
              { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              บันทึกการเปลี่ยนแปลง
            </Button>
          </Form.Item>
        </Form>
        
        <Button onClick={handleGoBack}>กลับ</Button>
      </Spin>
    </div>
  );
}
