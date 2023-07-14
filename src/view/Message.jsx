import './Message.scss';
import pure from '../util/pure';

const Message = {
    controller: function(data) {
    },
    view(ctrl, { icon, value, alt }) {
        return (
            <div m="Message" class="message">
                { icon }
                { value }
                { alt && (
                    <div class="message-alt">{ alt }</div>
                ) || null }
            </div>
        );
    },
};

export default pure(Message);
