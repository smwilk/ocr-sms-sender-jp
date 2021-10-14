import { useEffect, useState, useRef } from "react"
import "intl-tel-input/build/css/intlTelInput.css"
import intlTelInput from "intl-tel-input"

// SMS送信ステータス
const STATUSES = {
  IDLE: "",
  FAILED: "メッセージ送信に失敗しました。",
  PENDING: "メッセージ送信中...",
  SUCCEEDED: "メッセージ送信完了",
}

function SmsSender ({readText}) {
  const [smsText, setSmsText] = useState(readText)
  const [iti, setIti] = useState(null)
  const [smsSendingStatus, setSmsSendingStatus] = useState(STATUSES.IDLE)
  const inputRef = useRef(null)

  // International Telephone Inputを初期化
  const init = () => intlTelInput(inputRef.current, {
    initialCountry: "jp"
  })

  useEffect(() => {
    setIti(init())
  }, [])

  // SMS送信リクエスト
  const sendSMS = async () => {
    try {
      const country = iti.getSelectedCountryData()
      const num = `+${country.dialCode}${iti.telInput.value}`
      setSmsSendingStatus(STATUSES.PENDING)
      const res = await fetch("/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: num, text: smsText }),
      })
      const response = await res.json()
      setSmsSendingStatus(response.sid ? STATUSES.SUCCEEDED : STATUSES.FAILED)
    } catch (err) {
      setSmsSendingStatus(STATUSES.FAILED)
    }
  }

  // 送信ボタンが押されたタイミングでSMS送信する
  const handleSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    sendSMS()
  }
  
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>検知されたテキストを編集：</div>
        <div>
          <textarea
            rows="15"
            cols="45"
            name="name"
            defaultValue={readText}
            onChange={e => setSmsText(e.target.value)}
          />
        </div>
        <input
          ref={inputRef} 
          id="phone"
          name="phone"
          type="tel"
        />
        <div>
          <button disabled={smsSendingStatus == "Sending Message..."} type="submit">SMSメッセージを送信</button>
        </div>
      </form>
      <div class="status">
        {smsSendingStatus}
      </div>
    </div>
  )
}

export default SmsSender