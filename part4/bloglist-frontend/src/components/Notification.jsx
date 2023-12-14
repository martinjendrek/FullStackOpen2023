import '../styles/Notification.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  const notificationClass = `notification ${type}`
  return (
    <div className={notificationClass}>
      {message}
    </div>
  )
}

export default Notification