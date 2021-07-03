import React, { useState, useRef } from 'react';
import UploadImg from './assets/upload.svg'
import TextImg from './assets/text.svg'
import { createWorker } from 'tesseract.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import checkSensitive from './utils/dfa'
import './App.scss';

export default function App () {
  const [fileObj, setFileObj] = useState(null);
  const [inputTextFlag, setInputTextFlag] = useState(false);
  const [ockResText, seOckResText] = useState('');
  const [loading, setLoading] = useState(false)
  const ockWorker = useRef(createWorker({ logger: m => console.log(m) }));
  const InputRef = useRef(null)

  // 处理 file 文件改变
  const handleFileChange = e => {
    setFileObj(Array.from(e.target.files)[0])
  }

  // 处理输入文字
  const handleTextInput = () => {
    setInputTextFlag(true);
  }

  // OCR 识别
  const handleOck = async () => {
    if (!fileObj) {
      toast.warn('请先选文件')
      return
    }

    setLoading(true)
    await ockWorker.current.load();
    await ockWorker.current.loadLanguage('eng+chi_sim');
    await ockWorker.current.initialize('eng+chi_sim');
    const res = await ockWorker.current.recognize(fileObj);
    seOckResText(res.data.text);
    setLoading(false)
  }

  // 文字风险识别
  const handleTextRisk = () => {
    if (!ockResText) {
      toast.warn('请输入文字内容')
      return
    }
    const res = checkSensitive(ockResText.replace(/\s+/g, ''))
    if (res.length) {
      alert('你的输入包含不文明词汇：' + res.join('，'))
    } else {
      alert('合法输入')
    }
  }

  // 清空
  const handleReset = () => {
    setFileObj(null)
    seOckResText('')
    setInputTextFlag(false)
  }

  // 渲染类型框
  const renderRecognizeContent = () => {
    if (fileObj) {
      return (
        <div className="img-preview">
          <img src={URL.createObjectURL(fileObj)} alt="" />
        </div>
      )
    } else if (inputTextFlag) {
      return (
        <textarea className="text-input" onChange={e => seOckResText(e.target.value)}></textarea>
      )
    } else {
      return (
        <>
          <div className="upload">
            <img src={UploadImg} alt="" />
            <span>上传图片</span>
            <input type="file" ref={InputRef} onChange={handleFileChange} />
          </div>
          <div style={{ marginLeft: '32px' }} className="upload" onClick={handleTextInput}>
            <img src={TextImg} alt="" />
            <span>输入文字</span>
          </div>
        </>
      )
    }
  }

  return (
    <div className="app-wrap">
      <div className="left">
        {renderRecognizeContent()}
      </div>
      <div className="mid">
        <button disabled={loading} onClick={handleReset}>清空</button>
        <button disabled={loading || inputTextFlag} onClick={handleOck}>
          {loading ? '识别中...' : '识别文字'}
        </button>
        <button disabled={loading} onClick={handleTextRisk}>风险关键字识别</button>
      </div>
      <div className="right">{ockResText}</div>
      <ToastContainer />
    </div>
  )
}

