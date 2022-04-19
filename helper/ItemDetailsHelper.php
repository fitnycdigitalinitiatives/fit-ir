<?php
namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;
use Omeka\Api\Representation\AbstractResourceEntityRepresentation;

class ItemDetailsHelper extends AbstractHelper
{
    public function __invoke(AbstractResourceEntityRepresentation $resource)
    {
        $filterLocale = (bool) $this->getView()->siteSetting('filter_locale_values');
        $escape = $this->getView()->plugin('escapeHtml');
        $date = $resource->value('dcterms:date', ['lang' => ($filterLocale ? [$lang, ''] : null)]);
        $types = $resource->value('dcterms:type', ['all' => true, 'lang' => ($filterLocale ? [$lang, ''] : null)]);
        $class = $resource->displayResourceClassLabel();
        $typesList = [];
        foreach ($types as $type) {
            $typesList[] = ucfirst($escape($type));
        }
        $typesList[] = ucfirst($class);
        $typesList = array_unique($typesList);
        $typeLabels = [];
        $typeIcons = [];
        $iconList = ["Text", "Still Image", "Image", "Moving Image", "Sound", "Collection"];
        foreach ($typesList as $type) {
            if (in_array($type, $iconList)) {
                switch ($type) {
              case "Text":
                $typeIcons[] = '<i class="fas fa-file-alt" aria-hidden="true" title="Text"></i><span class="visually-hidden">Text</span>';
                break;
              case "Still Image":
                $typeIcons[] = '<i class="fas fa-image" aria-hidden="true" title="Image"></i><span class="visually-hidden">Image</span>';
                break;
              case "Image":
                $typeIcons[] = '<i class="fas fa-image" aria-hidden="true" title="Image"></i><span class="visually-hidden">Image</span>';
                break;
              case "Moving Image":
                $typeIcons[] = '<i class="fas fa-video" aria-hidden="true" title="Video"></i><span class="visually-hidden">Video</span>';
                break;
              case "Sound":
                $typeIcons[] = '<i class="fas fa-volume-up" aria-hidden="true" title="Audio"></i><span class="visually-hidden">Audio</span>';
                break;
                case "Collection":
                  $typeIcons[] = '<i class="fas fa-layer-group" aria-hidden="true" title="Collection"></i><span class="visually-hidden">Collection</span>';
                  break;
            }
            } else {
                $typeLabels[] = $type;
            }
        }

        $html = '<div class="date-class-type"><ul class="list-inline mb-0">';
        if ($date) {
            $html .= '<li class="date list-inline-item">' . $date->asHtml() . '</li>';
        }
        if ($typeLabels) {
            foreach ($typeLabels as $label) {
                $html .= '<li class="type list-inline-item">'. $label .'</li>';
            }
        }
        if ($typeIcons) {
            foreach ($typeIcons as $icon) {
                $html .= '<li class="type list-inline-item">'. $icon .'</li>';
            }
        }
        $html .= '</ul></div>';
        return  $html;
    }
}
