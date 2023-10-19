import React , {useState} from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(1);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  let maxPage = Math.ceil(totalPosts / postsPerPage) / postsPerPage;
  
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  const current = (pageNumbers) => {
    let current = 0;
    current = pageNumbers.slice(indexOfFirst, indexOfLast);
    return current;
  };
  
  return (
    <div className="pagination">
      <nav>
        <ul className="pagination">
          {currentPage > 1 &&  <>
            <li className="page-item" onClick={() => setCurrentPage(1)}><span className="page-link">{"<<"}</span></li>
            <li className="page-item" onClick={() => setCurrentPage(currentPage-1)}><span className="page-link">{"<"}</span></li>
            </>}
          {current(pageNumbers).map((number) => (
            <li key={number} onClick={(e) => {paginate(number); setSelected(number);}}  className= {selected === number ? "page-item page-item-selected" : "page-item"}>
              <span className= "page-link" >{number}</span>
            </li>
            ))}
          {currentPage < maxPage && <>
            <li className="page-item" onClick={() => setCurrentPage(currentPage+1)}><span className="page-link">{">"}</span></li>
            <li className="page-item" onClick={() => setCurrentPage(maxPage)}><span className="page-link">{">>"}</span></li>
            </>}
         </ul>
      </nav>
    </div>
  );
};

export default Pagination;