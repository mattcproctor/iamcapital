import re, sys, json, pickle
path=sys.argv[1]; want=set(sys.argv[2].split(','))
def parse_values(s, i):
    rows=[]; n=len(s)
    while i<n:
        while i<n and s[i] in ' ,\n': i+=1
        if i>=n or s[i]==';': break
        assert s[i]=='(', s[i:i+50]; i+=1; row=[]
        while True:
            c=s[i]
            if c=="'":
                i+=1; buf=[]
                while True:
                    c=s[i]
                    if c=='\\':
                        nx=s[i+1]; buf.append({'n':'\n','r':'\r','t':'\t','0':'\0','Z':'\x1a'}.get(nx,nx)); i+=2
                    elif c=="'":
                        if s[i+1:i+2]=="'": buf.append("'"); i+=2
                        else: i+=1; break
                    else:
                        j=i
                        while s[j] not in "\\'": j+=1
                        buf.append(s[i:j]); i=j
                row.append(''.join(buf))
            else:
                j=i
                while s[j] not in ',)': j+=1
                v=s[i:j].strip(); row.append(None if v=='NULL' else v); i=j
            if s[i]==',': i+=1; continue
            if s[i]==')': i+=1; break
        rows.append(row)
    return rows
out={}
s=open(path,encoding='utf-8',errors='surrogateescape').read()
for m in re.finditer(r'CREATE TABLE `([^`]+)` \((.*?)\n\)',s,re.S):
    if m.group(1) in want: out[m.group(1)]={'cols':re.findall(r'^\s+`([^`]+)`',m.group(2),re.M),'rows':[]}
for m in re.finditer(r'INSERT INTO `([^`]+)` VALUES',s):
    if m.group(1) in want: out[m.group(1)]['rows']+=parse_values(s,m.end())
pickle.dump(out,open(sys.argv[3],'wb'))
for t in out: print(t,len(out[t]['rows']))
