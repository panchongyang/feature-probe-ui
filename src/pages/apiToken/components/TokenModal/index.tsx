import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Dropdown, DropdownProps, Form } from 'semantic-ui-react';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import FormItem from 'components/FormItem';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import Modal from 'components/Modal';
import { TOKENTYPE } from 'interfaces/token';
import { hooksFormContainer, tokenInfoContainer } from '../../provider';
import { createToken } from 'services/tokens';
import { HeaderContainer } from 'layout/hooks';
import { OWNER } from 'constants/auth';
import TextLimit from 'components/TextLimit';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  handleCancel?: () => void;
  refresh?: () => unknown;
}

const TokenModal: React.FC<IProps> = (props) => {
  const { open, handleCancel, refresh } = props;
  const [loading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  const intl = useIntl();
  const { userInfo } = HeaderContainer.useContainer();

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    handleSubmit,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const { tokenInfo, init, handleChange } = tokenInfoContainer.useContainer();

  useEffect(() => {
    register('name', {
      required: {
        value: true,
        message: intl.formatMessage({ id: 'common.name.required' }),
      },
    });
    register('role', {
      required: {
        value: true,
        message: intl.formatMessage({ id: 'members.select.role.placeholder' }),
      },
    });
  }, [register, intl]);

  const options = useMemo(() => {
    const ops = [
      {
        key: 'WRITER',
        value: 'WRITER',
        text: 'Writer',
        content: (
          <div>
            <div className={styles['role-title']}>Writer</div>
            <div className={styles['role-desc']}>
              <FormattedMessage id="members.writer.auth.text" />
            </div>
          </div>
        ),
      },
      {
        key: 'OWNER',
        value: 'OWNER',
        text: 'Owner',
        content: (
          <div className={styles['role-item']}>
            <div className={styles['role-title']}>Owner</div>
            <div className={styles['role-desc']}>
              <FormattedMessage id="members.owner.auth.text" />
            </div>
          </div>
        ),
      },
    ];
    return ops.slice(0, OWNER.includes(userInfo.role) ? 2 : 1);
  }, [userInfo]);

  const onCopy = useCallback(() => {
    const clipboardObj = navigator.clipboard;
    clipboardObj.writeText(token);
    message.success(intl.formatMessage({ id: 'common.copy.success.text' }));
  }, [token, intl]);

  const onSubmit = useCallback(async () => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await createToken<{ token: string }>({
        type: TOKENTYPE.APPLICATION,
        name: tokenInfo.name,
        role: tokenInfo.role,
      });

      if (res.success && res.data) {
        message.success(intl.formatMessage({ id: 'token.create.success' }));
        setStatus(true);
        setToken(res.data?.token);
        refresh && refresh();
      } else {
        message.error(intl.formatMessage({ id: 'token.create.error' }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [errors, tokenInfo, intl, refresh]);

  const onClose = useCallback(() => {
    setStatus(false);
    init();
    clearErrors();
    handleCancel && handleCancel();
  }, [init, clearErrors, handleCancel]);

  return (
    <Modal
      width={480}
      footer={<></>}
      handleCancel={() => {
        init();
        handleCancel && handleCancel();
      }}
      open={open}
    >
      <div>
        <div className={styles['modal-header']}>
          <span className={styles['modal-header-text']}>
            {status ? (
              <TextLimit maxWidth={300} text={intl.formatMessage({ id: 'token.created.modal.title' }, { name: tokenInfo.name })} />
            ) : (
              <FormattedMessage id="token.application.create.text" />
            )}
          </span>
          <Icon customclass={styles['modal-close-icon']} type="close" onClick={onClose} />
        </div>
        <div className={styles['header-tips-container']}>
          <div className={styles['header-tips']}>
            <span className={styles['warning-circle']}>
              <Icon type="warning-circle" />
            </span>
            {status ? <FormattedMessage id="token.copy.tips" /> : <FormattedMessage id="token.application.add.tips" />}
          </div>
        </div>
        {status ? (
          <div>
            <div className={styles['copy-token']}>
              <TextLimit text={tokenInfo.name} maxWidth={80} />
              <div>:</div>
              <div className={styles['token']}>
                <CopyToClipboardPopup text={token}>
                  <span>{token}</span>
                </CopyToClipboardPopup>
              </div>
            </div>
            <div
              className={styles['footer']}
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
              }}
            >
              <Button size="mini" onClick={onCopy} primary>
                <FormattedMessage id="token.copy.text" />
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              className={styles['form-item-name']}
              error={errors.name}
              required
              label={<FormattedMessage id="token.form.name.text" />}
            >
              <Form.Input
                onChange={(e, detail) => {
                  handleChange(detail, 'name');
                  setValue('name', detail.value);
                  trigger('name');
                }}
                error={errors.name ? true : false}
                name="name"
                placeholder={intl.formatMessage({ id: 'common.name.required' })}
              />
            </FormItem>
            <FormItem
              className={styles['form-item-role']}
              error={errors.role}
              required
              label={<FormattedMessage id="members.role" />}
              errorCss={{
                marginTop: 0,
              }}
            >
              <Dropdown
                fluid
                floating
                selection
                clearable
                value={tokenInfo.role}
                name="role"
                error={errors.role ? true : false}
                options={options}
                placeholder={intl.formatMessage({ id: 'toggles.returntype.placeholder' })}
                icon={<Icon customclass={styles['angle-down']} type="angle-down" />}
                onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                  handleChange(detail, 'role');
                  setValue(detail.name, detail.value);
                  await trigger('role');
                }}
              />
            </FormItem>
            <div className={styles['role-tips']}>
              <FormattedMessage id="token.role.tips" />
            </div>
            <div
              className={styles['footer']}
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
              }}
            >
              <Button size="mini" className={styles['btn']} basic type="reset" onClick={onClose}>
                <FormattedMessage id="common.cancel.text" />
              </Button>
              <Button size="mini" loading={loading} disabled={loading} type="submit" primary>
                <FormattedMessage id="common.confirm.text" />
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default TokenModal;
