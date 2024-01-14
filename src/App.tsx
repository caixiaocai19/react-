import React from 'react'
import { ConfigProvider } from 'antd';
import SearchKeyWord from './SearchKeyWord';
export default function App() {
  return (
  <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
    <SearchKeyWord />
  </ConfigProvider>
  )
}