import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../services/axios';
import Block from './Block';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [blocksLength, setBlocksLength] = useState(0);

  useEffect(() => {
    const fetchPaginatedBlocks = async (pagination) => {
      const { data } = await axios.get(`/api/blocks/${pagination}`);
      setBlocks(data);
      return data;
    };
    fetchPaginatedBlocks(pagination);
  }, [pagination]);

  useEffect(() => {
    const fetchBlocksLength = async () => {
      const { data } = await axios.get('/api/blocks/length');
      setBlocksLength(data);
      return data;
    };
    fetchBlocksLength();
  }, []);

  return (
    <div className='blocks'>
      <h3>Blocks</h3>
      <div>
        {[...Array(Math.ceil(blocksLength / 5)).keys()].map((key) => {
          const pagintaionId = key + 1;
          return (
            <span key={key}>
              <Button
                bsstyle='primary'
                bssize='small'
                style={{ outlineWidth: 0 }}
                onClick={() => setPagination(pagintaionId)}
              >
                {pagintaionId}
              </Button>{' '}
            </span>
          );
        })}
      </div>
      {blocks?.map((block) => (
        <Block key={block?.hash} block={block} />
      ))}
    </div>
  );
};

export default Blocks;
