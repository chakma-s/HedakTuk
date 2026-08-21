const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/customer-app/src');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') && !filePath.includes('ThemeToggle.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles(srcDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Remove Colors from import
  if (content.includes('import { Colors } from \'@/constants/theme\';')) {
    content = content.replace(
      'import { Colors } from \'@/constants/theme\';',
      'import { useTheme } from \'@/stores/themeStore\';'
    );
    changed = true;
  } else if (content.match(/import\s+\{([^}]*)Colors([^}]*)\}\s+from\s+['"]@\/constants\/theme['"]/)) {
    content = content.replace(
      /import\s+\{([^}]*)Colors([^}]*)\}\s+from\s+['"]@\/constants\/theme['"]/,
      (match, p1, p2) => {
        let newImports = (p1 + p2).split(',').map(s => s.trim()).filter(s => s);
        if (newImports.length > 0) {
          return `import { ${newImports.join(', ')} } from '@/constants/theme';\nimport { useTheme } from '@/stores/themeStore';`;
        } else {
          return `import { useTheme } from '@/stores/themeStore';`;
        }
      }
    );
    changed = true;
  }

  // 2. Inject useTheme inside main function component
  if (changed) {
    // Find export default function ComponentName(...) {
    const exportRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/;
    content = content.replace(exportRegex, (match, name, args) => {
      let injection = `\n  const Colors = useTheme();`;
      if (content.includes('const styles = StyleSheet.create')) {
        injection += `\n  const styles = createStyles(Colors);`;
      }
      return `${match}${injection}`;
    });

    // Handle const Component = () => { ... } case
    const arrowRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*\(([^)]*)\)\s*=>\s*\{/;
    if (!content.match(exportRegex) && content.match(arrowRegex)) {
      content = content.replace(arrowRegex, (match, name, args) => {
        let injection = `\n  const Colors = useTheme();`;
        if (content.includes('const styles = StyleSheet.create')) {
          injection += `\n  const styles = createStyles(Colors);`;
        }
        return `${match}${injection}`;
      });
    }

    // 3. Update StyleSheet.create
    if (content.includes('const styles = StyleSheet.create')) {
      content = content.replace('const styles = StyleSheet.create({', 'const createStyles = (Colors: any) => StyleSheet.create({');
    }

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
