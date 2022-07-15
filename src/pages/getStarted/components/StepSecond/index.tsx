import { useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import java from 'images/java.svg';
import rust from 'images/rust.svg';
import go from 'images/go.svg';
import python from 'images/python.svg';
import javascript from 'images/javascript.svg';
import android from 'images/android.svg';
import swift from 'images/swift.svg';
import styles from '../Steps/index.module.scss';

const SERVER_SIDE_SDKS = [
  {
    name: 'Java',
    logo: java,
  },
  {
    name: 'Rust',
    logo: rust,
  },
  {
    name: 'Go',
    logo: go,
  },
  {
    name: 'Python',
    logo: python,
  }
];

const CLIENT_SIDE_SDKS = [
  {
    name: 'JavaScript',
    logo: javascript,
  },
  {
    name: 'Android',
    logo: android,
  },
  {
    name: 'Swift',
    logo: swift,
  },
  {
    name: 'Objective-C',
    logo: '',
  }
];

interface IOption {
  name: string;
  logo: string
}

interface IProps {
  currentStep: number;
  saveStep(sdk: string): void;
  goBackToStep(step: number): void;
}

const CURRENT = 2;

const StepSecond = (props: IProps) => {
  const { currentStep, saveStep, goBackToStep } = props;
  const [ selectedSDK, saveSelectedSDK ] = useState<string>('');
  const [ selectedSDKLogo, saveSelectedSDKLogo ] = useState<string>('');

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT && (
            <>
              <div className={styles.circleCurrent}>{ CURRENT }</div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
        {
          currentStep < CURRENT && (
            <>
              <div className={styles.circle}>{ CURRENT }</div>
              <div className={styles.line}></div>
            </>
          )
        }
        {
          currentStep > CURRENT && (
            <>
              <div className={styles.checked}>
                <Icon type='check' />
              </div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.second.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <Form>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='connect.second.sdk' />
                  </label>
                  <Dropdown
                    fluid 
                    selection
                    floating
                    className={styles['dropdown']}
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    trigger={
                      <div className={styles.dropdown}>
                        {
                          selectedSDK ? (
                            <>
                              {
                                selectedSDKLogo && <img className={styles['dropdown-logo']} src={selectedSDKLogo} alt='logo' />
                              }
                              <span className={styles['dropdown-text']}>
                                { selectedSDK }
                              </span>
                            </>
                          ) : (
                            <FormattedMessage id='common.dropdown.placeholder' />
                          )
                        }
                      </div>
                    }
                  >
                    <Dropdown.Menu>
                      <Dropdown.Header content='Server-side SDKs' />
                      <Dropdown.Divider />
                      {
                        SERVER_SIDE_SDKS.map((sdk: IOption) => {
                          return (
                            <Dropdown.Item onClick={() => {
                              saveSelectedSDK(sdk.name);
                              saveSelectedSDKLogo(sdk.logo);
                            }}>
                              <img src={sdk.logo} alt='logo' />
                              { sdk.name }
                            </Dropdown.Item>
                          )
                        })
                      }
                      <Dropdown.Header content='Client-side SDKs' />
                      <Dropdown.Divider />
                      {
                        CLIENT_SIDE_SDKS.map((sdk: IOption) => {
                          return (
                            <Dropdown.Item onClick={() => {
                              saveSelectedSDK(sdk.name);
                              saveSelectedSDKLogo(sdk.logo);
                            }}>
                              {
                                sdk.logo && <img src={sdk.logo} alt='logo' />
                              }
                              { sdk.name }
                            </Dropdown.Item>
                          )
                        })
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Field>
                <Button 
                  primary 
                  type='submit'
                  disabled={!selectedSDK}
                  onClick={() => {
                    saveStep(selectedSDK);
                  }}
                >
                  <FormattedMessage id='connect.save.continue.button' />
                </Button>
              </Form>
            )
          }
          {
            currentStep > CURRENT && (
              <div className={styles.card}>
                <div className={styles['card-left']}>
                  {
                    selectedSDKLogo && <img className={styles['dropdown-logo']} src={selectedSDKLogo} alt='logo' />
                  }
                  <span className={styles['dropdown-text']}>
                    { selectedSDK }
                  </span>
                </div>
                <div className={styles['card-right']}>
                  <Icon type='edit' onClick={() => {
                    goBackToStep(CURRENT);
                  }} />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default StepSecond;