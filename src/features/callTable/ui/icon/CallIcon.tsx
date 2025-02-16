import incomingIcon from "../../../../shared/icons/incoming.png";
import outgoingIcon from "../../../../shared/icons/outgoing.png";
import cgtIcon from "../../../../shared/icons/cgt.png";
import missedIcon from "../../../../shared/icons/missed.png";
interface CallIconProps {
  inOut: number;
  status: string;
}
export const CallIcon: React.FC<CallIconProps>  = ({inOut, status})=> {
  let type: string;
  if (inOut === 1) {
    type = 'incoming';
  } else if (status === "Не дозвонился") {
    type = 'cgt';
  } else if (inOut === 0) {
    type = 'outgoing';
  } else {
    type = 'missing';
  }

  switch (type) {
    case 'incoming':
      return <img src={incomingIcon} alt="incoming" />;
    case 'cgt':
      return <img src={cgtIcon} alt="cgt" />;
    case 'outgoing':
      return <img src={outgoingIcon} alt="outgoing" />;
    default:
      return <img src={missedIcon} alt="missing" />;
  }
}
