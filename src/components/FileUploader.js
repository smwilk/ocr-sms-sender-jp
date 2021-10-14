import { useState } from "react"
import { createWorker } from "tesseract.js"

// 画像のOCR処理ステータス
const STATUSES = {
  IDLE: "",
  FAILED: "OCR処理に失敗しました。",
  PENDING: "OCR処理中...",
  SUCCEEDED: "OCR処理完了",
}

function FileUploader({onReadData, onRemoveClicked}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [loadingState, setLoadingState] = useState(STATUSES.IDLE)
  const worker = createWorker()

  // 画像のOCR処理開始
  const initImageReading = async() => {
    if (!selectedImage) {
      return
    }
    setLoadingState(STATUSES.PENDING)
    await readImageText()
  }
  
  // 画像のOCR処理
  const readImageText = async() => {
    try {
      await worker.load()
      // OCRで読み取りたい言語を設定
      await worker.loadLanguage("jpn")
      await worker.initialize("jpn")
      const { data: { text } } = await worker.recognize(selectedImage)
      await setLoadingState(STATUSES.SUCCEEDED)
      await worker.terminate()
      
      // 日本語テキストはスペースが入ってしまう可能性があるので、スペースを削除
      const strippedText = text.replace(/\s+/g, "")
      onReadData(strippedText)
    } catch (err) {
      setLoadingState(STATUSES.FAILED)
    }
  }
  
  // 別の画像を使用するボタンを押した時の処理
  const handleRemoveClicked = () => {
    setSelectedImage(null)
    onRemoveClicked()
  }

  return (
    <div>
      {selectedImage && (
        <div>
          <img width="250px" src={URL.createObjectURL(selectedImage)} alt="scanned file"  />
        </div>
      )}
      <div>
        {selectedImage?
          <div className="button-container">
            <button onClick={initImageReading}>画像をOCR処理する</button>
            <button onClick={handleRemoveClicked} className="remove-button">別の画像を使用する</button>
          </div>
          :
          <>
            <p>画像ファイルをアップロードしてください。</p>
            <input
              type="file"
              name="ocr-image"
              onChange={(event) => {
                setSelectedImage(event.target.files[0])
              }}
            />
            <p>対応フォーマット：bmp、jpg、png、pbm</p>
          </>
        }
      </div>
      <div class="status">
        {loadingState}
      </div>
      <br />
    </div>
  )
}

export default FileUploader