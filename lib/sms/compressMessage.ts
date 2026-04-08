export  function compressMessage(message: string , limit = 160) {
    if (message.length <= limit) return message;

    return message.slice(0 , limit - 3) + "...";
}