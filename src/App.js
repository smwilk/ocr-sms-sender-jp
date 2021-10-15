import { useState } from "react"
import OcrReader from "./components/OcrReader"
import SmsSender from "./components/SmsSender"

function App() {
  const [ocrData, setOcrData] = useState("")

  // 子コンポーネントからOCRデータをPropsとして受け取る
  const onReadOcrData = (ocrData) => {
    setOcrData(ocrData)
  }

  // 子コンポーネントで別の画像を使用するボタンが押されたことをPropsで検知する
  const onRemoveClicked = () => {
    setOcrData("")
  }

  return (
    <div className="App">
      <header>OCRアプリへようこそ！</header>
      <OcrReader
        onReadOcrData={onReadOcrData}
        onRemoveClicked={onRemoveClicked}
      />
      {ocrData && <SmsSender readText={ocrData}/>}
    </div>
  )
}

export default App
