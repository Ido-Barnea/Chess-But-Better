import React from 'react';

const LeftColumn = () => {
  return (
    <div id="left-column">
      <table id="info-container">
        <tbody>
          <tr>
            <td id="info-container-round-information" colSpan="3"></td>
          </tr>
          <tr id="info-container-players"></tr>
        </tbody>
      </table>
      <div className="purchasable-container">
        <p>Shop</p>
        <input type="checkbox" id="shop-upgrade-swapper" />
        <p>Tree</p>
      </div>
      <div id="piece-upgrades-container" className="collapsed center-horizontally"></div>
      <div id="shop-container" className="center-horizontally"></div>
      <div id="inventories-container" className="center-horizontally"></div>
    </div>
  );
};

export default LeftColumn;
