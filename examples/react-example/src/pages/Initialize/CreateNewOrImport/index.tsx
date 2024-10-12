import React from 'react';
import { createComponent } from '@lit/react';
import { useNavigate } from 'react-router-dom';
import { CreateOrImport } from 'common-web/dist';

const InitializeCreateOrImportBase = createComponent({
  react: React,
  tagName: 'initialize-create-or-import',
  elementClass: CreateOrImport,
  // Defines props that will be event handlers for the named events
  events: {
    onClickCreateNew: 'onClickCreateNew',
    onClickImportExist: 'onClickImportExist',
  },
});

export const InitializeCreateOrImport = () => {
  const navigate = useNavigate();

  return (
    <InitializeCreateOrImportBase
      onClickCreateNew={() => navigate('/initialize/backup-prompt')}
      onClickImportExist={() => {
        console.log('导入现有钱包');
      }}
    />
  );
};
