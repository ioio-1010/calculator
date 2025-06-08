import React, { useState, useEffect } from 'react';
import './App.css';

const defaultShipping = {
  nekoposu: 190,
  soko_mail: 190,
  soko_takuhai: 430,
};

const shippingOptions = [
  { label: 'ネコポス', value: 'nekoposu' },
  { label: '倉庫(メール便)', value: 'soko_mail' },
  { label: '倉庫(宅配便)', value: 'soko_takuhai' },
];

const priceSteps = [
  { min: 0, max: 999, value: 1000 },
  { min: 1000, max: 1280, value: 1280 },
  { min: 1281, max: 1480, value: 1480 },
  { min: 1481, max: 1680, value: 1680 },
  { min: 1681, max: 1980, value: 1980 },
  { min: 1981, max: 2280, value: 2280 },
  { min: 2281, max: 2480, value: 2480 },
  { min: 2481, max: 2680, value: 2680 },
  { min: 2681, max: 2980, value: 2980 },
  { min: 2981, max: 3480, value: 3480 },
  { min: 3481, max: 3980, value: 3980 },
];

function getAutoPrice(val: number): string {
  for (const step of priceSteps) {
    if (val >= step.min && val <= step.max) return String(step.value);
  }
  return '';
}

function App() {
  // 入力値のstate
  const [yuan, setYuan] = useState<string>('');
  const [yenRate, setYenRate] = useState<number>(22);
  const [feeIncluded, setFeeIncluded] = useState<number>(28);
  const [mallFeeRate, setMallFeeRate] = useState<number>(20);
  const [shippingMethod, setShippingMethod] = useState<string>('nekoposu');
  const [shippingValues, setShippingValues] = useState<{[key:string]: number}>({...defaultShipping});
  const [price, setPrice] = useState<string>('');
  const [autoPrice, setAutoPrice] = useState<string>('');

  // 自動計算欄
  const costYen = yuan ? Number(yuan) * feeIncluded : 0;
  const mallFee = price ? Math.round(Number(price) * (mallFeeRate / 100)) : 0;
  const shipping = shippingValues[shippingMethod];
  const profit = price ? Number(price) - (costYen + mallFee + shipping) : 0;

  // 配送料金の自動反映
  useEffect(() => {
    // shippingMethod変更時にshipping値を更新
  }, [shippingMethod]);

  // 販売価格の自動入力
  useEffect(() => {
    if (costYen) {
      const auto = getAutoPrice(costYen * 3);
      setAutoPrice(auto);
      if (auto !== '' && price === '') setPrice(auto);
    } else {
      setAutoPrice('');
    }
  }, [costYen, price]);

  useEffect(() => {
    if (autoPrice && price === '') setPrice(autoPrice);
  }, [autoPrice, price]);

  // 配送料の入力変更
  const handleShippingChange = (key: string, value: string) => {
    setShippingValues(prev => ({ ...prev, [key]: Number(value) }));
  };

  return (
    <div className="main-content">
      <h1 className="main-title">金額計算ツール</h1>
      <div className="card-group">
        <div className="card input-card">
          <h2>入力</h2>
          <div className="input-row">
            <label>原価(元)</label>
            <input type="number" className="input-red strong-input short-input" value={yuan} onChange={e => { setYuan(e.target.value); setPrice(''); }} placeholder="" />
          </div>
          <div className="input-row">
            <label>元</label>
            <input type="number" className="input-yellow short-input" value={yenRate} onChange={e => setYenRate(Number(e.target.value))} />
          </div>
          <div className="input-row">
            <label>手数料込み</label>
            <input type="number" className="input-yellow short-input" value={feeIncluded} onChange={e => setFeeIncluded(Number(e.target.value))} />
          </div>
          <div className="input-row">
            <label>配送方法</label>
            <select className="input-green select-wide" value={shippingMethod} onChange={e => setShippingMethod(e.target.value)}>
              {shippingOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="input-row">
            <label>モール手数料(%)</label>
            <input type="number" className="input-yellow short-input" value={mallFeeRate} onChange={e => setMallFeeRate(Number(e.target.value))} />
          </div>
        </div>
        <div className="card output-card">
          <h2>計算結果</h2>
          <div className="output-row">
            <span>原価(円)</span>
            <span>{yuan ? costYen : '-'}</span>
          </div>
          <div className="output-row">
            <span>モール手数料</span>
            <span>{price ? mallFee : '-'}</span>
          </div>
          <div className="output-row">
            <span>配送料金</span>
            <span>{shipping}</span>
          </div>
          <div className="output-row">
            <span>販売価格</span>
            <input type="number" className="input-red strong-input" value={price} onChange={e => setPrice(e.target.value)} placeholder={autoPrice} />
          </div>
          <div className="output-row">
            <span>利益</span>
            <span className="profit-strong">{price ? profit : '-'}</span>
          </div>
        </div>
        <div className="card info-card">
          <h2>配送料</h2>
          <ul className="shipping-list">
            {shippingOptions.map(opt => (
              <li key={opt.value}>
                <span>{opt.label}</span>
                <input
                  type="number"
                  className="input-yellow short-input shipping-input-narrow"
                  value={shippingValues[opt.value]}
                  onChange={e => handleShippingChange(opt.value, e.target.value)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
