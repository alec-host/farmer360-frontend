import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 40px;
  width: auto;
  border-radius: 3px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #F97316;
  padding: 0 32px 0 16px;
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 40px;
  width: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <div className="container-fluid">
      <div className="row">
      <Input
          id="search"
          type="text"
          className="form-control"
          placeholder="Filter table data..."
          value={filterText}
          onChange={onFilter}
      />
      <ClearButton className="btn btn-secondary fw-bold mx-1 px-3" onClick={onClear}>Clear</ClearButton>
      </div>
    </div>
  </>
);

export default FilterComponent;
