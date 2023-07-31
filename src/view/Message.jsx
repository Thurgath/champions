import './Message.scss';

function Message() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { icon, value, alt } = vnode.attrs;
            return (
                <div m="Message" class="message" >
                    { icon }
                    { value }
                    { alt && (
                        <div class="message-alt">{ alt }</div>
                    ) || null }
                </div>
            );
        },
    };
}

export default Message;
