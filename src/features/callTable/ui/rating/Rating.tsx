interface RatingProps {
    time: number
  }

export const Rating: React.FC<RatingProps>  = ({time}) => {
  const options = ["Хорошо", "Плохо", "Отлично", "Скрипт не использован"];
  const rating = time === 0 ? "Скрипт не использован" : options[Math.floor(Math.random() * options.length)];

  const getColor = (rating: string) => {
    switch (rating) {
      case "Отлично":
        return { color: "#28A879", backgroundColor: "#DBF8EF", borderWidth: 1, borderColor: "#28A879" };
      case "Плохо":
        return { color: "#EA1A4F", backgroundColor: "#FEE9EF", borderWidth: 1, borderColor: "#EA1A4F" };
      case "Хорошо":
        return { color: "#122945", backgroundColor: "#ADBFDF", borderWidth: 1, borderColor: "#122945" };
      default:
        return { color: "#EA1A4F" };
    }
  };

  return (
    <div className="call-table_rating" style={getColor(rating)}>
      {rating}
    </div>
  );
};
