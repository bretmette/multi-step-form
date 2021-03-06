(function ($) {
	'use strict';

	var container = '#fw-wizard-container';
	var elementsContainer = '#fw-elements-container';

	function log() {
		'console' in window && console.log.apply(console, arguments);
	}

	function warn() {
		'console' in window && console.warn.apply(console, arguments);
	}

    /**
     * Return a step with an empty section and no values set.
     */
	function emptyStep() {
		return {
			title: '',
			headline: '',
			copy_text: '',
			parts: [{
				title: '',
				blocks: []
			}]
		};
	}

	function alertMessage(message, success) {
		var color;
		if (success) {
			color = '#4caf50';
		} else {
			color = '#f44336';
		}
		$('<div id="fw-alert" style="background-color:' + color + '">' +
			message + '</div>')
			.hide().appendTo("#wpbody-content")
			.slideDown()
			.delay(3000)
			.slideUp();
	}

	function escapeAttribute(s) {
		return ('' + s).replace(/\\/g, '\\\\').replace(/"/g, '&quot;');
	}

	function renderBlockAction(type) {
		var blockAction = '<div class="fw-block-action fw-block-hndle">';
		blockAction += '<i class="fa fa-arrows fw-move-block fw-block-hndle" aria-hidden="true"></i>';
		blockAction += '<h4>' + type + '</h4>';
		blockAction += '</div>';
		return blockAction;
	}

    /**
     * renderRadioHeader - renders the header for radio
     *
     * @param  radioHeader the radio header object
     */
	function renderRadioHeader(radioHeader) {
		var radioHeaderHtml = '<div class="fw-radio-option-element" data-type="header"><label>' + wizard.i18n.label + '</label>';
		radioHeaderHtml += '<input type="text" class="fw-radio-header fw-block-label" value="' + radioHeader + '"></input>';
		radioHeaderHtml += '</div>';
		return radioHeaderHtml;
	}


    /**
     * renderRadioOption - description
     *
     * @param  radioOption the radio option
     * @param  idx this options index
     * @return the html for the radio option
     */
	function renderRadioOption(radioOption, idx) {
		var radioOptionHtml = '<div class="fw-radio-option-element" data-type="option">'; //'<label>Option ' + idx + '</label>';
		radioOptionHtml += '<input type="text" class="fw-radio-option" placeholder="' + wizard.i18n.radio.option + ' ' + idx + '" value="' + escapeAttribute(radioOption) + '"></input>';
		radioOptionHtml += '<div class="fw-remove-radio-option"><i class="fa fa-minus-circle" aria-hidden="true"></i></div></div>';
		return radioOptionHtml;
	}

	function renderRadio(radio) {
		log('radio', radio);
		var i, n, optCount = 0;
		var radioHtml = '';
		var element;
		// elements
		radioHtml += '<div class="fw-radio-option-container">';
		for (i = 0, n = radio.elements.length; i < n; i++) {
			element = radio.elements[i];
			log('element', element);
			if (element.type === 'option') {
				if (i == 1) {
					radioHtml += '<label>' + wizard.i18n.radio.options + '</label>';
				}
				radioHtml += renderRadioOption(element.value, (1 + optCount++));
			} else {
				radioHtml += renderRadioHeader(element.value);
			}

		}
		radioHtml += '</div>';
		radioHtml += '<button class="fw-radio-add"><i class="fa fa-plus" aria-hidden="true"></i> ' + wizard.i18n.radio.addOption + '</button><br/>';
		radioHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(radio.required) + '/> ' + wizard.i18n.required + '</label>';
		if (radio.multichoice == "true") {
			radioHtml += '<label><input type="checkbox" class="fw-radio-multichoice" checked/>' + wizard.i18n.radio.multiple + ' <i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.tooltips.multiChoice + '"></i></label>';
		} else {
			radioHtml += '<label><input type="checkbox" class="fw-radio-multichoice"/>' + wizard.i18n.radio.multiple + ' <i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.tooltips.multiChoice + '"></i></label>';
		}
		return radioHtml;
	}

	function renderSelect(select) {
		log('select', select);
		var i = 0;
		var selectHtml = '';
		var element;
		var placeholder = wizard.i18n.select.placeholder ? wizard.i18n.select.placeholder : '';
		selectHtml += '<div class="fw-select-option-container">';
		selectHtml += '<label>' + wizard.i18n.label + '</label>';
		selectHtml += '<input type="text" class="fw-block-label" value="' + select.label + '"></input>';
		selectHtml += '<label>' + placeholder + '</label>';
		selectHtml += '<input type="text" class="fw-select-placeholder" value="' + select.placeholder + '"></input>';
		selectHtml += '<label>' + wizard.i18n.select.options + '</label>';
		selectHtml += '<textarea class="fw-select-options" rows="4" cols="50">';
		for (i = 0; i < select.elements.length; i++) {
			selectHtml += select.elements[i] + "\n";
		}
		selectHtml += '</textarea>';
		selectHtml += '</div>';
		selectHtml += '<label><input type="checkbox" class="fw-select-search"' + isChecked(select.search) + '/>' + wizard.i18n.select.search + '</label>';
		selectHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(select.required) + '/> ' + wizard.i18n.required + '</label>';

		return selectHtml;
	}

	function renderCheckbox(block) {
		log('checkbox', block);
		var textHtml = '';
		textHtml += '<label>' + wizard.i18n.label + '</label>';
		textHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		textHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return textHtml;
	}

	function renderTextInput(block) {
		log('textInput', block);
		var textHtml = '';
		textHtml += '<label>' + wizard.i18n.label + '</label>';
		textHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		textHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return textHtml;
	}

	function renderEmail(block) {
		var emailHtml = '';
		emailHtml += '<label>' + wizard.i18n.label + '</label>';
		emailHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		emailHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return emailHtml;
	}

	function renderNumeric(block) {
		var numericHtml = '';
		numericHtml += '<label>' + wizard.i18n.label + '</label>';
		numericHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		numericHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		numericHtml += '<label>' + wizard.i18n.numeric.minimum + '</label>';
		numericHtml += '<input type="text" class="fw-numeric-minimum fw-block-label" placeholder="' + wizard.i18n.numeric.no_minimum + '" value="' + (block.minimum ? block.minimum : '') + '" pattern="-?\\d*"></input><br/><br/>';
		numericHtml += '<label>' + wizard.i18n.numeric.maximum + '</label>';
		numericHtml += '<input type="text" class="fw-numeric-maximum fw-block-label" placeholder="' + wizard.i18n.numeric.no_maximum + '" value="' + (block.maximum ? block.maximum : '') + '" pattern="-?\\d*"></input><br/>';
		return numericHtml;
	}

	function renderFile(block) {
		var fileHtml = '';
		fileHtml += '<label>' + wizard.i18n.label + '</label>';
		fileHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		fileHtml += '<label><input type="checkbox" class="fw-file-multi"' + isChecked(block.multi) + '/>' + wizard.i18n.multifile + '</label>';
		fileHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return fileHtml;
	}

	function renderDate(block) {
		var dateHtml = '';
		dateHtml += '<label>' + wizard.i18n.label + '</label>';
		dateHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		dateHtml += '<label>' + wizard.i18n.dateformat + '<a target="_blank" href="http://t1m0n.name/air-datepicker/docs/#sub-section-9"><i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.tooltips.dateformat + '"></i></a></label>';
		dateHtml += '<input type="text" class="fw-date-format fw-block-label" placeholder="' + wizard.i18n.dateformat + '" value="' + (block.format ? block.format : 'yy-mm-dd') + '" ></input><br/>';
		dateHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return dateHtml;
	}

	function renderTextArea(block) {
		log('textArea', block);
		var textAreaHtml = '';
		textAreaHtml += '<label>' + wizard.i18n.label + '</label>';
		textAreaHtml += '<input type="text" class="fw-textarea-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		textAreaHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return textAreaHtml;
	}

	function renderParagraph(block) {
		var paragraphHtml = '';
		paragraphHtml += '<label>' + wizard.i18n.paragraph.textHtml + ' <i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.tooltips.paragraph + '"></i></label>';
		paragraphHtml += '<textarea class="fw-paragraph-text fw-block-label" placeholder="' + wizard.i18n.paragraph.text + '">' + (block.text ? block.text : '') + '</textarea>';
		paragraphHtml += '<label style="display:none;"><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return paragraphHtml;
	}

	function renderRegex(block) {
		var regexHtml = '';
		regexHtml += '<label>' + wizard.i18n.label + '</label>';
		regexHtml += '<input type="text" class="fw-text-label fw-block-label" placeholder="' + wizard.i18n.label + '" value="' + block.label + '"></input><br/>';
		regexHtml += '<label>' + wizard.i18n.filter + '</label>';
		regexHtml += '<input type="text" class="fw-regex-filter fw-block-label" placeholder="' + wizard.i18n.filter + '" value="' + (block.filter ? block.filter : '') + '"></input><br/>';
		regexHtml += '<label>' + wizard.i18n.filterError + '</label>';
		regexHtml += '<input type="text" class="fw-regex-error fw-block-label" placeholder="' + wizard.i18n.filterError + '" value="' + (block.customError ? block.customError : '') + '"></input><br/>';
		regexHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		return regexHtml;
	}

	function renderRegistration(block) {
		var registrationHtml = '';
		registrationHtml += '<label><input type="checkbox" class="fw-required"' + isChecked(block.required) + '/>' + wizard.i18n.required + '</label>';
		registrationHtml += '<p class="msfp-registration-info">' + wizard.i18n.registration.info + '</p>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-email" checked disabled="disabled"/>' + wizard.i18n.registration.email + '</label>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-username" checked disabled="disabled"/>' + wizard.i18n.registration.username + '</label>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-password"' + isChecked(block.password) + '/>' + wizard.i18n.registration.password + '</label>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-firstname"' + isChecked(block.firstname) + '/>' + wizard.i18n.registration.firstname + '</label>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-lastname"' + isChecked(block.lastname) + '/>' + wizard.i18n.registration.lastname + '</label>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-website"' + isChecked(block.website) + '/>' + wizard.i18n.registration.website + '</label>';
		registrationHtml += '<label class="msfp-registration-option"><input type="checkbox" class="msfp-registration-bio"' + isChecked(block.bio) + '/>' + wizard.i18n.registration.bio + '</label>';
		return registrationHtml;
	}

	function renderBlock(block) {
		log('block', block);
		var error = false;
		var blockHtml = '<div class="fw-step-block" data-type="' + block.type + '" >';
		blockHtml += '<div class="fw-block-controls">';
		blockHtml += '<i class="fa fa-remove fw-remove-block" title="' + wizard.i18n.tooltips.removeBlock + '" aria-hidden="true"></i>';
		blockHtml += '<i class="fa fa-caret-up fw-toggle-block" aria-hidden="true"></i>';
		blockHtml += '</div>';
		// removepart button
		blockHtml += renderBlockAction(block.type);
		blockHtml += '<div class="fw-block-fields">';
		switch (block.type) {
			case 'radio':
				if (!block.elements) {
					block.elements = [{
						type: 'header',
						value: ''
					}, {
						type: 'option',
						value: ''
					}];
				}
				blockHtml += renderRadio(block);
				break;
			case 'select':
				if (!block.elements) {
					block.elements = [];
				}
				blockHtml += renderSelect(block);
				break;
			case 'checkbox':
				blockHtml += renderCheckbox(block);
				break;
			case 'text':
				blockHtml += renderTextInput(block);
				break;
			case 'email':
				blockHtml += renderEmail(block);
				break;
			case 'numeric':
				blockHtml += renderNumeric(block);
				break;
			case 'file':
				blockHtml += renderFile(block);
				break;
			case 'date':
				blockHtml += renderDate(block);
				break;
			case 'textarea':
				blockHtml += renderTextArea(block);
				break;
			case 'paragraph':
				blockHtml += renderParagraph(block);
				break;
			case 'regex':
				blockHtml += renderRegex(block);
				break;
			case 'registration':
				blockHtml += renderRegistration(block);
				break;
			default:
				break;
		}
		blockHtml += '</div>';
		blockHtml += '<div class="fw-clearfix"></div>';
		blockHtml += '</div>';
		if (error) {
			blockHtml = '';
		}
		return blockHtml;
	}

	function renderBlocks(blocks) {
		var blocksHtml = '';
		var i, n;
		for (i = 0, n = blocks.length; i < n; i++) {
			if (blocks[i].type == 'conditional') {
				// unwrap conditional block
				blocksHtml += renderBlock(blocks[i].block);
				// add conditional settings as block metadata
				var conditionalSettings = {
					prec_block_id: blocks[i].prec_block_id,
					prec_operator: blocks[i].prec_operator,
					prec_value: blocks[i].prec_value,
					visible: blocks[i].visible
				};
				// remove last closing div tag to add conditional meta information
				blocksHtml = blocksHtml.slice(0, -6)
				blocksHtml += '<input class="msf-block-meta" name="msf-block-meta-' + i + '" type="hidden" value="' + encodeURI(JSON.stringify(conditionalSettings)) + '">';
				blocksHtml += '</div>';
			} else {
				blocksHtml += renderBlock(blocks[i]);
			}
		}
		return blocksHtml;
	}

	function renderPart(part, partClass) {
		log('part', part);
		var partHtml = '<div class="' + partClass + '">';

		// handle
		partHtml += '<div class="fw-section-hndle"><i class="fa fa-arrows"></i></div>';

		// title
		partHtml += '<input type="text" class="fw-part-title" value="' + part.title + '" placeholder="' + wizard.i18n.partTitle + '"></input>';

		// removepart button
		partHtml += '<div class="fw-remove-part" title="' + wizard.i18n.removeSection + '">';
		partHtml += '<i class="fa fa-remove"></i>';
		partHtml += '</div><div class="inside connectedSortable">';

		// blocks
		partHtml += renderBlocks(part.blocks);

		// drag&drop or click here to add elements
		partHtml += '</div><div class="fw-add-element">';
		partHtml += '<a href="#TB_inline?width=400&height=200&inlineId=fw-thickbox-content" class="thickbox"><i class="fa fa-plus"></i> ' + wizard.i18n.addElement + '</a>';
		partHtml += '</div>';

		partHtml += '</div>';

		return partHtml;
	}

	function getPartClass(i, n) {
		var partClass = 'fw-step-part';
		// if (n > 1) {
		//     if (i == 0) {
		//         partClass += ' fw-left';
		//     } else {
		//         partClass += ' fw-right';
		//     }
		// }
		return partClass;
	}


	function renderParts(parts) {
		var i, n = parts.length,
			partsHtml = '<div><div class="fw-parts-header"><h3>Sections</h3></div>';
		partsHtml += '<div class="fw-column-buttons">';
		partsHtml += '<button type="button" class="fw-button-one-column"><i class="fa fa-align-justify"></i></button>';
		partsHtml += '<button type="button" class="fw-button-two-columns"><i class="fa fa-align-justify"></i> <i class="fa fa-align-justify"></i></button>';
		partsHtml += '</div>';
		partsHtml += '<div class="fw-parts-container">';
		for (i = 0, n = parts.length; i < n; i++) {
			var partClass = getPartClass(i, n);
			partsHtml += renderPart(parts[i], partClass);
		}
		partsHtml += '</div>';
		partsHtml += '<div class="fw-parts-footer">';
		partsHtml += '<a class="fw-add-part"><i class="fa fa-plus"></i> ' + wizard.i18n.addSection + '</a>';
		partsHtml += '</div>';
		partsHtml += '</div>';
		return partsHtml;
	}

	function renderStepInside(step, idx) {
		var titleId = "fw-title-" + idx;
		var headlineId = "fw-headline-" + idx;
		var copyTextId = "fw-copy-text-" + idx;
		var stepHtml = '<div class="fw-step"><div class="form-wrap">';

		// title
		stepHtml += '<div class="input form-field">';
		stepHtml += '<label for="' + titleId + '"><b>' + wizard.i18n.title + '</b>';
		stepHtml += '<i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.tooltips.title + '"></i></label>';
		stepHtml += '<input type="text" class="fw-step-title" value="' + step.title + '"></input>';
		stepHtml += '</div>';

		// headline
		stepHtml += '<div class="input form-field">';
		stepHtml += '<label for="' + headlineId + '"><b>' + wizard.i18n.headline + '</b>';
		stepHtml += '<i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.tooltips.headline + '"></i></label>';
		stepHtml += '<input type="text" class="fw-step-headline" value="' + step.headline + '"></input>';
		stepHtml += '</div>';

		// copy text
		stepHtml += '<div class="input form-field">';
		stepHtml += '<label for="' + copyTextId + '"><b>' + wizard.i18n.copyText + '</b>';
		stepHtml += '<i class="fa fa-info-circle" aria-hidden="true" title="' + wizard.i18n.copyText + '"></i></label>';
		stepHtml += '<input type="text" class="fw-step-copy_text" value="' + step.copy_text + '"></input>';
		stepHtml += '</div>';

		// parts
		stepHtml += '<div class="fw-step-parts">' + renderParts(step.parts) + '</div>';
		stepHtml += '</div><div class="fw-clearfix"></div></div>';
		return stepHtml;
	}

	function renderStep(step) {
		var stepHtml = '<div class="postbox">';
		stepHtml += '<div class="fw-movediv hndle ui-sortable-handle"><i class="fa fa-arrows"></i></div>';
		stepHtml += '<h1 class="fw-step-h1 hndle ui-sortable-handle"><span>';
		stepHtml += step.title + '</span></h1>';
		stepHtml += '<div class="fw-step-controls">';
		stepHtml += '<i class="fa fa-remove fw-remove-step" title="' + wizard.i18n.tooltips.removeStep + '" aria-hidden="true"></i>';
		stepHtml += '<i class="fa fa-caret-up fw-toggle-step" aria-hidden="true"></i>';
		stepHtml += '<i class="fa fa-files-o fw-duplicate-step" title="duplicate step" aria-hidden="true"></i>';
		stepHtml += '</div>';
		stepHtml += '<div class="fw-clearfix"></div>';
		stepHtml += renderStepInside(step);
		stepHtml += '<div class="fw-clearfix"></div>';
		stepHtml += '</div>';
		return stepHtml;
	}

	function renderFormSettings(formSettings) {
		if (formSettings) {
			if (formSettings.thankyou) {
				$('.fw-settings-thankyou').val(formSettings.thankyou);
			}
			if (formSettings.subject) {
				$('.fw-mail-subject').val(formSettings.subject);
			}
			if (formSettings.to) {
				$('.fw-mail-to').val(formSettings.to);
			}
			if (formSettings.frommail) {
				$('.fw-mail-from-mail').val(formSettings.frommail);
			}
			if (formSettings.fromname) {
				$('.fw-mail-from-name').val(formSettings.fromname);
			}
			if (formSettings.header) {
				$('.fw-mail-header').val(formSettings.header);
			}
			if (formSettings.headers) {
				$('.fw-mail-headers').val(formSettings.headers);
			}
		}
	}

	function renderSteps(steps) {
		var i, n;
		var stepsHtml = '<div class="postbox-container"><div class="metabox-holder"><div class="meta-box-sortables">';
		for (i = 0, n = steps.length; i < n; i++) {
			stepsHtml += renderStep(steps[i], i);
		}
		stepsHtml += '</div>';
		stepsHtml += '<a class="fw-element-step"><i class="fa fa-plus"></i> ' + wizard.i18n.addStep + '</a>';
		stepsHtml += '</div></div>';
		$(container).html(stepsHtml);
	}


    /**
     * getRadioElementData - retrieve the data for a set of radio buttons
     *
     * @param $element the radio DOM element
     * @return an object with the radio header and options
     */
	function getRadioElementData($element) {
		var data = {};
		var type = data.type = $element.attr('data-type');
		if (type === 'option') {
			data.value = $element.find('.fw-radio-option').val();
		} else if (type === 'header') {
			data.value = $element.find('.fw-radio-header').val();
		}
		return data;
	}

	function getRadioData($radio, radio) {
		var elements = radio['elements'] = [];
		$radio.find('.fw-radio-option-element').each(function (idx, element) {
			elements.push(getRadioElementData($(element)));
		});
		radio['required'] = $radio.find('.fw-required').prop('checked');
		radio['multichoice'] = $radio.find('.fw-radio-multichoice').prop('checked');
	}

	function getSelectData($select, select) {
		var options = $select.find(".fw-select-options").val().split("\n");
		select['required'] = $select.find('.fw-required').prop('checked');
		select['search'] = $select.find('.fw-select-search').prop('checked');
		select['label'] = $select.find('.fw-block-label').val();
		select['placeholder'] = $select.find('.fw-select-placeholder').val();
		select['elements'] = options.filter(function (v) { return v !== '' && v !== ' ' });
	}


	// TODO: redundant functions

	function getCheckboxData($checkbox, checkbox) {
		checkbox['label'] = $checkbox.find('.fw-text-label').val();
		checkbox['required'] = $checkbox.find('.fw-required').prop('checked');
	}

	function getTextData($text, text) {
		text['label'] = $text.find('.fw-text-label').val();
		text['required'] = $text.find('.fw-required').prop('checked');
	}

	function getEmailData($text, text) {
		text['label'] = $text.find('.fw-text-label').val();
		text['required'] = $text.find('.fw-required').prop('checked');
	}

	function getNumericData($text, text) {
		text['label'] = $text.find('.fw-text-label').val();
		text['required'] = $text.find('.fw-required').prop('checked');
		text['minimum'] = $text.find('.fw-numeric-minimum').val();
		text['maximum'] = $text.find('.fw-numeric-maximum').val();
	}

	function getFileData($text, text) {
		text['label'] = $text.find('.fw-text-label').val();
		text['required'] = $text.find('.fw-required').prop('checked');
		text['multi'] = $text.find('.fw-file-multi').prop('checked');
	}

	function getDateData($text, text) {
		text['label'] = $text.find('.fw-text-label').val();
		text['format'] = $text.find('.fw-date-format').val();
		text['required'] = $text.find('.fw-required').prop('checked');
	}

	function getTextareaData($text, text) {
		text['label'] = $text.find('.fw-textarea-label').val();
		text['required'] = $text.find('.fw-required').prop('checked');
	}

	function getParagraphData($text, text) {
		text['text'] = $text.find('.fw-paragraph-text').val();
	}

	function getRegexData($text, text) {
		text['label'] = $text.find('.fw-text-label').val();
		text['filter'] = $text.find('.fw-regex-filter').val();
		text['customError'] = $text.find('.fw-regex-error').val();
		text['required'] = $text.find('.fw-required').prop('checked');
	}

	function getRegistrationData($text, text) {
		text['required'] = $text.find('.fw-required').prop('checked')
		text['password'] = $text.find('.msfp-registration-password').prop('checked')
		text['firstname'] = $text.find('.msfp-registration-firstname').prop('checked')
		text['lastname'] = $text.find('.msfp-registration-lastname').prop('checked')
		text['website'] = $text.find('.msfp-registration-website').prop('checked')
		text['bio'] = $text.find('.msfp-registration-bio').prop('checked')
	}

	function getConditionalData($block) {
		var block = {};
		block['type'] = 'conditional';
		block['visible'] = $block.find('.msfp-conditional-visible').val();
		block['prec_block_id'] = $block.find('.msfp-conditional-prec-block-id').val();
		block['prec_operator'] = $block.find('.msfp-conditional-prec-op').val();
		block['prec_value'] = $block.find('.msfp-conditional-prec-value').val();
		block['block'] = getBlockData($block);
		return block;
	}

    /**
     * getBlockData - get the data from backend input fields
     *
     * @param $block the block to get data from
     * @return the block data
     */
	function getBlockData($block) {
		var block = {};
		var type = block['type'] = $block.attr('data-type');
		switch (type) {
			case 'radio':
				getRadioData($block, block);
				break;
			case 'select':
				getSelectData($block, block);
				break;
			case 'checkbox':
				getCheckboxData($block, block);
				break;
			case 'text':
				getTextData($block, block);
				break;
			case 'email':
				getEmailData($block, block);
				break;
			case 'numeric':
				getNumericData($block, block);
				break;
			case 'file':
				getFileData($block, block);
				break;
			case 'date':
				getDateData($block, block);
				break;
			case 'textarea':
				getTextareaData($block, block);
				break;
			case 'paragraph':
				getParagraphData($block, block);
				break;
			case 'regex':
				getRegexData($block, block);
				break;
			case 'registration':
				getRegistrationData($block, block);
				break;
		}
		return block;
	}

	function getPartData($part) {
		var part = {};
		part['title'] = $part.find('.fw-part-title').val();
		var blocks = part['blocks'] = [];
		$part.find('.fw-step-block').each(function (idx, element) {
			var $block = $(element);
			// PLUS: mark as conitional if settings are set
			if ($block.find('.msfp-conditional').prop("checked")) {
				blocks.push(getConditionalData($block));
			} else {
				blocks.push(getBlockData($block));
			}
		});
		return part;
	}

	function getStepData($step) {
		var step = {};
		step['title'] = $step.find('.fw-step-title').val();
		step['headline'] = $step.find('.fw-step-headline').val();
		step['copy_text'] = $step.find('.fw-step-copy_text').val();
		var parts = step['parts'] = [];
		var $parts = $step.find('.fw-step-part');
		$parts.each(function (idx, element) {
			parts.push(getPartData($(element)));
		});

		return step;
	}

	function getSettings() {
		var settings = {};
		// General settings
		settings.thankyou = $('.fw-settings-thankyou').val();
		// Mail settings
		settings.to = $('.fw-mail-to').val();
		settings.frommail = $('.fw-mail-from-mail').val();
		settings.fromname = $('.fw-mail-from-name').val();
		settings.subject = $('.fw-mail-subject').val();
		settings.header = $('.fw-mail-header').val();
		settings.headers = $('.fw-mail-headers').val();
		return settings;
	}

	function isEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!email) {
			return false;
		}
		return regex.test(email);
	}

	function validateSettings(settings) {
		var valid = true;
		if (!isEmail(settings.to)) {
			valid = false;
			$('#fw-nav-settings').trigger('click');
			alertMessage(wizard.i18n.alerts.invalidEmail, false);
		} else if (!settings.subject) {
			valid = false;
			$('#fw-nav-settings').trigger('click');
			alertMessage(wizard.i18n.alerts.noSubject, false);
		}
		return valid;
	}

	function validateSteps(steps) {
		var valid = true;
		for (var i = 0; i < steps.length; i++) {
			var step = steps[i];
			if (!step.title) {
				valid = false;
				alertMessage(wizard.i18n.alerts.noStepTitle, false);
			} else {
				for (var j = 0; j < steps[i].parts.length; j++) {
					if (steps[i].parts[j].title === "") {
						valid = false;
						alertMessage(wizard.i18n.alerts.noSectionTitle, false);
					}
					for (var k = 0; k < steps[i].parts[j].blocks.length; k++) {
						var block = steps[i].parts[j].blocks[k];
						// TODO: validate conditional if checkbox is checked
					}
				}
			}
		}
		return valid;
	}

	function validate(data) {
		var valid = true;
		if (data.title === "") {
			valid = false;
			alertMessage(wizard.i18n.alerts.noFormTitle, false);
		} else {
			valid = validateSteps(data.wizard.steps) && validateSettings(data.wizard.settings);
		}
		return valid;
	}

	function save() {
		var $container = $(container);
		var title = $('.fw-wizard-title').val();
		var valid;
		var data = {
			wizard: {}
		};
		// data['title']
		data.wizard.title = title;
		data.wizard.steps = [];
		data.wizard.settings = getSettings();
		var $steps = $container.find('.fw-step');
		$steps.each(
			function (idx, element) {
				var last = idx == $steps.length - 1;
				data.wizard.steps.push(getStepData($(element)));
			}
		);
		data.wizard.steps.push();

		if (validate(data)) {

			log('save', data);
			//log('ajaxurl', wizard.ajaxurl);
			//log('nonce', wizard.nonce);

			$.ajax({
				type: 'POST',
				url: wizard.ajaxurl,
				dataType: 'json',
				data: {
					action: 'fw_wizard_save',
					data: data,
					nonce: wizard.nonce,
					id: wizard.id
				},
				success: function (response) {
					if (response.data.nonce !== undefined) {
						wizard.nonce = response.data.nonce;
					}

					wizard.id = response.data.id;
					alertMessage(response.data.msg, response.success);
				},
				error: function (response) {
					log('fail', arguments);
					log('response', response);
				}
			});
		}
	}

    /**
     * blockOut - description
     *
     * @param  event the event
     * @param  ui the ui element
     */
	function blockOut(event, ui) {
		log('blockOut', event, ui);
		$(event.target).removeClass('fw-over');
	}

    /**
     * setupDragNDrop - prepare the draggables, sortables and droppables
     *
     * @return {helper}  some helpers for draggables
     */
	function setupDragNDrop() {
		$('.meta-box-sortables').sortable({
			opacity: 0.6,
			revert: true,
			cursor: 'move',
			handle: '.hndle',
			tolerance: 'pointer',
			placeholder: 'fw-block-placeholder',
			start: function (event, ui) {
				var height = $(ui.item).height();
				$('.fw-block-placeholder').height(height);
			},
			update: function (event, ui) {
				warn('sortables update', event, ui);
				$(ui.item).removeAttr('style');
				setupDragNDrop();
				setupTooltips();
			}
		});

		$('.fw-step-part .inside').sortable({
			opacity: 0.6,
			cursor: 'move',
			connectWith: '.connectedSortable',
			handle: '.fw-block-hndle',
			tolerance: 'intersect',
			placeholder: 'fw-block-placeholder',
			revert: 100,
			start: function (event, ui) {
				var height = $(ui.item).height(),
					$placeholder = $('.fw-block-placholder');
				$placeholder.height(height);
				$placeholder.attr('data-type', ui.item.attr('data-type'));
			},
			update: function (event, ui) {

				var blockType = $(ui.item).attr('data-type');
				var newBlockIdx = -1;
				if ($(ui.item).is('.fw-draggable-block')) {
					if (blockType === 'registration' && hasRegistration()) {
						alertMessage("Only one registration block allowed!", false);
						$(ui.item).remove();
					} else {
						// add element
						var $newBlock = $(renderBlock({
							type: blockType,
							label: ''
						}));
						$(ui.item).replaceWith($newBlock);
						// get new Block index for keeping conditionals working
						newBlockIdx = $('.fw-step-block').index($newBlock);
						console.log($newBlock + " " + newBlockIdx);
					}
				}
				setupDragNDrop();
				setupTooltips();
				setupClickHandlers();
				if (msfp) {
					setupConditionals(newBlockIdx);
				}
			}
		});

		$('.fw-parts-container').sortable({
			opacity: 0.6,
			cursor: 'move',
			connectWith: '.fw-parts-container',
			handle: '.fw-section-hndle',
			tolerance: 'intersect',
			placeholder: 'fw-section-placeholder',
			revert: 100,
			start: function (event, ui) {
				var height = $(ui.item).height();
				$('.fw-section-placeholder').height(height);
			},
			update: function (event, ui) {
				setupDragNDrop();
				setupTooltips();
				setupClickHandlers();
			}
		});

		//        make step divs toggleable
		//        console.log(postboxes);
		//        postboxes.add_postbox_toggles('multi-step-form');

		var stepScope = 'fw-wizard-elements-scope';
		var blockScope = 'fw-wizard-block-scope';

		$(elementsContainer + ' .fw-draggable-block').draggable({
			connectToSortable: '.fw-step-part .inside',
			revert: 'invalid',
			helper: 'clone',
			cursor: 'move',
		});

		$(container).find('.fw-step-title').on('change input', titleOnChange);
	}


    /**
     * setupTooltips - creates tooltips for better usability
     */
	function setupTooltips() {
		$('.fa-info-circle').tooltip();
		$('.fw-remove-step').tooltip();
		$('.fw-duplicate-step').tooltip();
		$('.fw-remove-part').tooltip();
		$('.fw-remove-block').tooltip();
		$('.hndle.ui-sortable-handle').tooltip();
	}


    /**
     * titleOnChange - Dynamically changes the step h1 to
     * the current title
     *
     * @param  {type} evt description
     * @return {type}     description
     */
	function titleOnChange(evt) {
		var $this = $(this);

		log('titleOnChangeU', $this.val());

		$this.closest('.postbox').find('h1 > span').html($this.val());
	}


    /**
     * updateOptions - updates the radioOptions data-attribute after adding/removing
     *
     * @param  $container the radio container
     */
	function updateOptions($container) {
		$container.find('.fw-radio-option-element[data-type="option"] > label').each(
			function (idx, elt) {
				log('updateOptions', elt);
				$(elt).html('Option ' + (idx + 1));
			}
		);
	}


    /**
     * addStep - add a step to the wizard
     */
	function addStep(step) {
		var n = $('.fw-step').length;
		if (n < 5 || msfp) {
			if (n < 10) {
				var $step = $(renderStep(step));
				$step.appendTo($(container).find('.meta-box-sortables'));

				setupClickHandlers();
				setupDragNDrop();
				setupThickbox();

				if (n > 0) {
					// scroll down to new step
					$("html, body").animate({
						scrollTop: $(document).height() - $step.height() - 180
					}, 500);
				}
			} else {
				alertMessage(wizard.i18n.alerts.onlyTen, false);
			}
		} else {
			alertMessage(wizard.i18n.alerts.onlyFive, false);
		}
	}

	function duplicateStep($step) {
		var data = getStepData($step);
		data.title += ' (COPY)';
		addStep(data);
	}

    /**
     * isChecked - description
     *
     * @param  block the block to check if it's required
     * @return the checked-attribure for html or nothing at all
     */
	function isChecked(val) {
		var attr = '';
		if (val == 'true') {
			attr = 'checked';
		}
		return attr;
	}

	function hasRegistration() {
		var result = false;
		$('.fw-step-block').each(function (i, element) {
			if ($(element).attr('data-type') == 'registration') {
				result = true;
			}
		});
		return result;
	}

    /**
     * addPart - adds a part to a step
     *
     * @param  evt the addPart-Button in a step
     */
	function addPart(evt) {
		var target = evt.target;
		var part = renderPart({
			title: '',
			blocks: []
		}, 'fw-step-part');
		$(target).closest('.fw-step-parts').find('.fw-parts-container').append(part);
		// setup handler for new part
		$('.fw-remove-part').click(function (event) {
			removePart(event);
		});
		setupThickbox();
	}

	function removeStep() {
		var $this = $(this);
		var $step = $this.closest('.postbox');
		var r = confirm(wizard.i18n.alerts.reallyDeleteStep);
		if (r === true) {
			$step.slideUp(700, function () {
				$step.remove();
			});
		}
	}

    /**
     * removePart - removes a part (section) from a step
     *
     * @param  evt the addPart-Button in a step
     */
	function removePart(evt) {
		var $part = $(evt.target).closest('.fw-step-part');
		var r = confirm(wizard.i18n.alerts.reallyDeleteSection);
		if (r === true) {
			$part.slideUp(500, function () {
				$part.remove();
			});
		}
	}

	function removeBlock(evt) {
		var $block = $(evt.target).closest('.fw-step-block');
		var label = $block.find('.fw-block-label').val();
		var r = confirm(wizard.i18n.alerts.reallyDeleteBlock + "\n\n" + label);
		if (r === true) {
			$block.slideUp(300, function () {
				$block.remove();
			});
		}
	}

	function setupThickbox() {
		$(".thickbox").click(function (thickEvent) {
			// RADIO BUTTONS
			$("#fw-thickbox-radio").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'radio'
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// SELECT
			$("#fw-thickbox-select").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'select',
					label: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});

			// TEXT FIELD
			$("#fw-thickbox-text").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'text',
					label: '',
					value: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// EMAIL
			$("#fw-thickbox-email").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'email',
					label: '',
					value: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// NUMERIC
			$("#fw-thickbox-numeric").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'numeric',
					label: '',
					value: '',
					minimum: '',
					maximum: '',
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// FILE UPLOAD
			$("#fw-thickbox-fileupload").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'file',
					label: '',
					value: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
			});
			// TEXT AREA
			$("#fw-thickbox-textarea").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'textarea',
					label: '',
					value: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// DATE
			$("#fw-thickbox-date").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'date',
					label: '',
					format: 'yy-mm-dd'
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// PARAGRAPH
			$("#fw-thickbox-paragraph").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'paragraph',
					text: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// REGEX
			$("#fw-thickbox-regex").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'regex',
					label: '',
					filter: '',
					customError: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				$part.find('.inside').append(block);
				setupClickHandlers();
				if (msfp) {
					setupConditionals(block);
				}
			});
			// REGISTRATION
			$("#fw-thickbox-registration").unbind('click').click(function (thickRadioEvent) {
				tb_remove();
				var block = $(renderBlock({
					type: 'registration',
					label: '',
					value: ''
				}));
				var $part = $(thickEvent.target).parents('.fw-step-part');
				if (hasRegistration()) {
					alertMessage("Only one registration block allowed!", false);
				} else {
					$part.find('.inside').append(block);
				}
				setupClickHandlers();
			});
		});
	}

	function maskNumericInput(e) {
		if ($('input[type=text]').index($(e.target)) != -1) {
			if (
				($.inArray(e.keyCode, [37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 8, 13, 189]) == -1) // digits, digits in num pad, 'back', 'enter',  '-'
				|| (e.keyCode == 189 && $(e.target).val().indexOf("-") != -1) // not allow double '-'
				|| (e.keyCode == 198 && $(e.target).val().length != 0) // only allow '-' at the begining
			) {
				e.preventDefault();
			}
		}
	}

	function setupClickHandlers() {
		// add step handler
		$('.fw-element-step').unbind("click").click(function (event) {
			addStep(emptyStep());
		});

		$('.fw-duplicate-step').unbind("click").click(function (event) {
			var $step = $(this).parent().parent().find('.fw-step');
			duplicateStep($step);
		});

		// add part handler
		$('.fw-add-part').unbind("click").click(function (event) {
			addPart(event);
			setupDragNDrop();
		});

		$('.fw-toggle-step').unbind("click").click(function (event) {
			$(this).parent().parent().find('.fw-step').slideToggle();
			$(this).toggleClass('fw-icon-rotated');
		});

		// remove part handler
		$('.fw-remove-part').unbind("click").click(function (event) {
			removePart(event);
		});

		// remove block handler
		$('.fw-remove-block').unbind("click").click(function (event) {
			removeBlock(event);
		});

		$('.fw-toggle-block').unbind("click").click(function (event) {
			var $block = $(this).parent().parent();
			$block.toggleClass('fw-block-collapsed');
			if ($block.hasClass('fw-block-collapsed')) {
				var label = $block.find('.fw-block-label').val();
				$block.find('h4').text(label);
				$(this).addClass('fw-icon-rotated');
			} else {
				var blockType = $block.data('type');
				$block.find('h4').text(blockType);
				$(this).removeClass('fw-icon-rotated');
			}
		});
	}

    /**
     * run - this function sets everything up
     */
	function run() {
		try {
			var w = JSON.parse(wizard.json);
			var $container = $(container);

			if (w.wizard.title) {
				// load the wizard title
				$('.fw-wizard-title').val(w.wizard.title);
			} else {
				$('.fw-wizard-title').val('My Multi Step Form');
			}
			var steps = w.wizard.steps && w.wizard.steps.length > 0 ? w.wizard.steps : [emptyStep()];
			renderSteps(steps);

			// get mail settings
			renderFormSettings(w.wizard.settings);

			$('.fw-button-save').click(save);

			//TODO: put all click handlers in the corresponding function

			// make elements sticky
			$(window).scroll(function () {
				var offset = $('.nav-tab-wrapper').height() + 19;
				var scrollTop = $(this).scrollTop();
				if (scrollTop > offset) {
					$(elementsContainer).addClass('fw-sticky');
				} else {
					$(elementsContainer).removeClass('fw-sticky');
				}
			});

			// toggle postboxes
			$container.on('click', '.postbox .handlediv', function () {
				$(this).closest('.postbox').toggleClass('closed');
			});

			$container.on('click', '.fw-radio-add', function () {
				var $cnt = $(this).prev('.fw-radio-option-container');
				var idx = $cnt.children('.fw-radio-option-element').length;
				var opt = renderRadioOption('', idx);
				$(opt).appendTo($cnt);
				updateOptions($cnt);
			});

			$container.on('click', '.fw-remove-radio-option', function () {
				log('remove on click');
				var $this = $(this);
				var $container = $this.closest('.fw-radio-option-container');
				$this.closest('.fw-radio-option-element').remove();
				updateOptions($container);
			});

			$container.on('keydown', '.fw-numeric-minimum', maskNumericInput);
			$container.on('keydown', '.fw-numeric-maximum', maskNumericInput);

			$container.on('click', '.fw-remove-step', removeStep);

			setupDragNDrop();
			setupTooltips();
			setupThickbox();
			setupClickHandlers();

			// tab menu toggle
			$('#fw-nav-settings').click(function (e) {
				$('#fw-nav-steps').toggleClass('nav-tab-active');
				$('#fw-nav-settings').toggleClass('nav-tab-active');
				$(container).hide();
				$(elementsContainer).hide();
				$('.fw-mail-settings-container').show();
			});

			$('#fw-nav-steps').click(function (e) {
				$('#fw-nav-steps').toggleClass('nav-tab-active');
				$('#fw-nav-settings').toggleClass('nav-tab-active');
				$('.fw-mail-settings-container').hide();
				$(container).show();
				$(elementsContainer).show();
			});

			// modal
			$('#fw-elements-modal').dialog({
				dialogClass: 'wp-dialog',
				modal: true,
				autoOpen: false,
				closeOnEscape: true,
				buttons: {
					'Close': function () {
						$(this).dialog('close');
					}
				}
			});

		} catch (ex) {
			warn(ex);
		}
	}

	$(document).ready(run);
})(jQuery);
