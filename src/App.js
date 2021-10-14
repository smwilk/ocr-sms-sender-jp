import { useState } from "react"
import FileUploader from "./components/FileUploader"
import SmsSender from "./components/SmsSender"

function App() {
  const [data, setData] = useState("")

  const onReadData = (childData) => {
    setData(childData)
  }

  const onRemoveClicked = () => {
    setData("")
  }

  return (
    <div className="App">
      <header>OCRアプリへようこそ！</header>
      <FileUploader
        onReadData={onReadData}
        onRemoveClicked={onRemoveClicked}
      />
      {data && <SmsSender readText={data}/>}
    </div>
  )
}

export default App
