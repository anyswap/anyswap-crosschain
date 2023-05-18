export function setCookie(cname:string,cvalue:string,exdays = 1){
	const d:any = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	const expires = "expires=" + d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}
export function getCookie(cname:string){
	const name = cname + "=";
	const ca = document.cookie.split(';');
	for(let i=0; i<ca.length; i++) {
		const c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}