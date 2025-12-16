import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import "./ProductAccordion.scss";

const ProductAccordion = ({ details }: { details?: { header: string; body: any }[] }) => {
  if (!details?.length) return null;

  return (
    <>
      {details.map((productDetail, index) => (
        <Accordion key={index} style={{ margin: "0 0 16px", boxShadow: "none" }}>
          <AccordionSummary expandIcon={<div className='productAccordion__arrowIcon' />} style={{}}>
            <p className='productAccordion__headerText'>{productDetail.header}</p>
          </AccordionSummary>
          <AccordionDetails>
            <p className='productAccordion__bodyText' dangerouslySetInnerHTML={{ __html: productDetail.body }} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default ProductAccordion;
