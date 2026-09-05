function CategoryCard({
  icon,
  name,
  onClick,
}) {
  return (
    <div
      className="category-card"
      onClick={onClick}
      role="button"
      tabIndex="0"
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          onClick();
        }
      }}
    >
      <div className="category-icon">
        {icon}
      </div>

      <h3>{name}</h3>
    </div>
  );
}

export default CategoryCard;