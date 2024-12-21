import './App.css';
import TransactionList from "./components/TransactionList";
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Divider, Button } from 'antd';
import AddItem from './components/AddItem';
import { Spin, Typography } from 'antd';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337";
const URL_TXACTIONS = '/api/txactions';

function FinanceScreen({ onLogout }) {
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URL_TXACTIONS);
      setTransactionData(response.data.data.map(row => ({
        id: row.id,
        key: row.id,
        ...row.attributes
      })));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (item) => {
    try {
      setIsLoading(true);
      const params = { ...item, action_datetime: dayjs() };
      const response = await axios.post(URL_TXACTIONS, { data: params });
      const { id, attributes } = response.data.data;
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes }
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteChanged = (id, note) => {
    setTransactionData(
      transactionData.map(transaction => {
        transaction.note = transaction.id === id ? note : transaction.note;
        return transaction;
      })
    );
  };

  const handleRowDeleted = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${URL_TXACTIONS}/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRowUpdated = async (updatedRecord) => {
    try {
      setIsLoading(true);
      const { id, ...attributes } = updatedRecord; // แยก id และข้อมูลที่ต้องการส่ง
      await axios.put(`${URL_TXACTIONS}/${id}`, { data: attributes }); // อัปเดตข้อมูลใน API
      setTransactionData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...updatedRecord } : item // อัปเดตข้อมูลใน state
        )
      );
    } catch (err) {
      console.error("Failed to update record:", err);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setSummaryAmount(transactionData.reduce(
      (sum, transaction) => (
        transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount
      ), 0)
    );
  }, [transactionData]);

  return (
    <div className="App">
    <header className="App-header">
      <Spin spinning={isLoading}>
        <Typography.Title>
          จำนวนเงินปัจจุบัน {summaryAmount} บาท
        </Typography.Title>

        <AddItem onItemAdded={handleAddItem} />
        <Divider>บันทึก รายรับ - รายจ่าย</Divider>
        <TransactionList
          data={transactionData}
          onNoteChanged={handleNoteChanged}
          onRowDeleted={handleRowDeleted}
          onRowUpdated={handleRowUpdated}
        />
        
        {/* ปุ่ม Logout */}
        <Button type="primary" onClick={onLogout}>Logout</Button>

        {/* ปุ่มตั้งค่าบัญชี */}
        <Button type="default" onClick={() => window.location.href = "/account-settings"}>
          ตั้งค่าบัญชี
        </Button>
      </Spin>
    </header>
  </div>
  );
}

export default FinanceScreen;
