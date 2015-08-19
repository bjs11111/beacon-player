//create text for close button
var link_buttonText = document.createTextNode('Scan for new content');
//create close button
var link_button = document.createElement('a'); 
//
link_button.setAttribute('onclick', "window.close();");
link_button.setAttribute('href', 'close-iab');
link_button.id = 'iba-close-button';
link_button.style.fontSize = '14px';
link_button.style.textDecoration = 'none';
link_button.style.color = '#fff';
link_button.style.lineHeight = '20px';
link_button.style.textAlign	= 'center';
link_button.style.verticalAlign = 'middle';
link_button.style.backgroundColor = '#ef473a';
link_button.style.margin = '0px';
link_button.style.padding = '12px';
link_button.style.display = 'block';
link_button.appendChild(link_buttonText);

var footer = document.createElement('div');
footer.style.position = 'fixed';
footer.style.bottom = 0;
footer.style.left = 0;
footer.style.right = 0;
footer.style.zIndex = 2147483647;

footer.appendChild(link_button);

document.body.appendChild(footer);