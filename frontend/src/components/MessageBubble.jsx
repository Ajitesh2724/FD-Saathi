const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      animation: 'fadeInUp 0.3s ease',
    }}>
      {!isUser && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          marginRight: '8px',
          flexShrink: 0,
          marginTop: '4px',
        }}>
          🏦
        </div>
      )}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #1a6b3c, #2d9e5f)'
          : message.isError
          ? '#fff3f3'
          : 'white',
        color: isUser ? 'white' : '#2d3748',
        fontSize: '15px',
        lineHeight: '1.6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: !isUser ? '1px solid #e8f5ee' : 'none',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {message.content}
        <div style={{
          fontSize: '11px',
          opacity: 0.6,
          marginTop: '4px',
          textAlign: isUser ? 'right' : 'left',
        }}>
          {message.timestamp?.toLocaleTimeString('hi-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;