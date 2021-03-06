import {SOURCE} from "../common-js/OstBrowserMessenger";
import OstMessage from "../common-js/OstMessage";

const LOG_TAG = "OstSdk :: OstKeyManagerProxy";

export default class OstKeyManagerProxy {
  constructor(messengerObj, userId){
    this.messengerObj = messengerObj;
    this.userId = userId;
  }

	signApiParams(resource, params) {
  	let oThis = this;
		let functionParams = {
			user_id: this.userId,
			resource: resource,
			params: params
		};

  	return oThis.getFromKM('signApiParams', functionParams);
	}

  getDeviceAddress () {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
		};

		return oThis.getFromKM('getDeviceAddress', functionParams)
			.then((response) => {
				return response.device_address;
			});

	}

	getCurrentDeviceAddress () {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
		};

		return oThis.getFromKM('getCurrentDeviceAddress', functionParams)
			.then((response) => {
				return response.device_address;
			});
	}

  getApiKeyAddress ( ) {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
		};

		return oThis.getFromKM('getApiAddress', functionParams)
			.then((response) => {
				return response.api_signer_address;
			});
	}

	isTrustable( ) {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
		};

		return oThis.getFromKM('isTrustable', functionParams)
			.then((response) => {
				return response.is_trustable;
			});
	}

	setTrustable ( trustable ) {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
			trustable: trustable
		};

		return oThis.getFromKM('setTrustable', functionParams)
			.then((response) => {
				return response.is_trustable;
			});
	}

	createSessionKey() {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
		};

		return oThis.getFromKM('createSessionKey', functionParams)
	}

	signQRSessionData(sessionAddress, spendingLimit, expiryTime) {
		let oThis = this;
		let functionParams = {
			user_id: this.userId,
			session_address: sessionAddress,
			spending_limit: spendingLimit,
			expiry_time: expiryTime
		};

		return oThis.getFromKM('signQRSessionData', functionParams);
	}

	signTransaction(ostSession, userTokenHolderAddress, tokenHolderAddresses, amounts, ostRule, ruleMethod, pricePointBaseToken, options) {
		const oThis = this
			, transactionData = {
				session: ostSession,
				rule: ostRule,
				to_token_holder_addresses: tokenHolderAddresses,
			  from_token_holder_address: userTokenHolderAddress,
				amounts: amounts,
			  rule_method: ruleMethod,
				price_point: pricePointBaseToken,
				options: options
			}
			, functionParams = {
				user_id: this.userId,
				transaction_data: transactionData
			}
		;

		return oThis.getFromKM('signTransaction', functionParams);
	}

  deleteLocalSessions(sessionAddresses) {
      const oThis = this
		  , functionParams = {
          		user_id: this.userId,
				session_addresses: sessionAddresses
	  		}
	  ;
      return oThis.getFromKM('deleteLocalSessions', functionParams);
	}

	filterLocalSessions(sessions) {
  	const oThis = this
			, functionParams = {
				user_id: this.userId,
				sessions: sessions
			}
		;
  	return oThis.getFromKM('filterLocalSessions', functionParams)
			.then((response) => {
				return response.filtered_sessions;
			});
	}

	getFromKM(functionName, functionParams) {
		let oThis = this;
		return new Promise((resolve, reject) => {

			let subId = this.messengerObj.subscribe(new ResponseHandler(
				function (args) {
					console.log(LOG_TAG, `${functionName} get`, args);
					oThis.messengerObj.unsubscribe(subId);
					resolve(args);
				},
				function ( args ) {
					console.log(LOG_TAG, `${functionName} error`, args);
					oThis.messengerObj.unsubscribe(subId);
					reject(args);
				}
			));

			let message  = new OstMessage();
			message.setReceiverName("OstSdkKeyManager");
			message.setFunctionName(functionName);
			message.setArgs(functionParams, subId);
			console.log(LOG_TAG, functionName);
			this.messengerObj.sendMessage(message, SOURCE.DOWNSTREAM);
		});
	}

}

const ResponseHandler = function (success, error){
	const oThis = this;

	oThis.onSuccess = function(args) {
			return success(args);
	};

	oThis.onError = function(args) {
		return error(args);
	};

};
