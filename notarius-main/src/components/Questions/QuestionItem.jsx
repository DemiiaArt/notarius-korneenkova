import { useIsPC } from "@hooks/isPC";
import "./Questions.scss";

const QuestionItem = ({ title, text }) => {
  const isPC = useIsPC();

  return (
    <article className="questions-article">
      <h2
        className={`questions-article-title ${
          isPC ? "fs-p--32px" : "fs-p--18px"
        } fw-semi-bold lh-100`}
      >
        {title}
      </h2>
      <p
        className={`questions-article-text lh-150 ${
          isPC ? "fs-p--18px" : "fs-p--14px"
        }`}
      >
        {text}
      </p>
    </article>
  );
};

export default QuestionItem;
