import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios';

const URL_AUTH = "http://localhost:1337/api/auth/local";

export default function LoginScreen({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [form] = Form.useForm(); // ใช้ antd Form instance

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);

      const response = await axios.post(URL_AUTH, {
        identifier: formData.identifier,
        password: formData.password,
      });

      const token = response.data.jwt;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // เก็บ token และข้อมูลล็อกอินใน localStorage ถ้าติ๊ก Remember Me
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('identifier', formData.identifier);
        localStorage.setItem('password', formData.password); // **ระวังเรื่องความปลอดภัย**
      } else {
        sessionStorage.setItem('token', token);
      }

      onLoginSuccess(); // แจ้ง App ว่าล็อกอินสำเร็จ
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ตรวจสอบ token เมื่อเปิดหน้าเว็บ
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      onLoginSuccess();
    }

    // เติมข้อมูล identifier และ password ถ้ามีใน localStorage
    const savedIdentifier = localStorage.getItem('identifier');
    const savedPassword = localStorage.getItem('password');
    if (savedIdentifier && savedPassword) {
      form.setFieldsValue({
        identifier: savedIdentifier,
        password: savedPassword,
      });
      setRememberMe(true); // ตั้ง Remember Me เป็น true
    }
  }, [onLoginSuccess, form]);

  return (
    <Form form={form} onFinish={handleLogin} autoComplete="off">
      {errMsg && <Alert message={errMsg} type="error" />}
      <Form.Item
        label="Username or Email"
        name="identifier"
        rules={[{ required: true, message: 'Please input your username or email!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password autoComplete="new-password"/>
      </Form.Item>
      <Form.Item>
        <Checkbox
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        >
          Remember Me
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
